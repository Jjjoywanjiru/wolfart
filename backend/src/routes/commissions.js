import express from "express";
import prisma from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

const DEPOSIT_RATE = 0.3; // placeholder: confirm the real percentage with Wahu

router.post("/", requireAuth, async (req, res) => {
  if (req.user.role === "ADMIN") {
  return res.status(403).json({ error: "Admins can't send commission requests" });
}
  const { description, preferredMedium, budgetMin, budgetMax, desiredDate } = req.body;

  const min = Number(budgetMin);
  const max = Number(budgetMax);
  if (
    !description?.trim() ||
    !preferredMedium ||
    !Number.isFinite(min) ||
    !Number.isFinite(max) ||
    min < 0 ||
    max < min
  ) {
    return res
      .status(400)
      .json({ error: "A description, a medium and a valid budget range are required" });
  }

  let date = null;
  if (desiredDate) {
    date = new Date(desiredDate);
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ error: "Invalid date" });
    }
  }

  const request = await prisma.commissionRequest.create({
    data: {
      customerId: req.user.id,
      description: description.trim(),
      preferredMedium,
      budgetMin: min,
      budgetMax: max,
      desiredDate: date,
    },
  });
  res.status(201).json(request);
});

router.get("/mine", requireAuth, async (req, res) => {
  const requests = await prisma.commissionRequest.findMany({
    where: { customerId: req.user.id },
    include: {
      order: { select: { amount: true, depositAmount: true, paymentStatus: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(requests);
});

router.get("/", requireAuth, requireAdmin, async (req, res) => {
  const requests = await prisma.commissionRequest.findMany({
    include: {
      customer: { select: { id: true, name: true, email: true } },
      order: { select: { amount: true, depositAmount: true, paymentStatus: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(requests);
});

router.post("/:id/respond", requireAuth, requireAdmin, async (req, res) => {
  const { action, price } = req.body;

  const request = await prisma.commissionRequest.findUnique({
    where: { id: req.params.id },
  });
  if (!request) return res.status(404).json({ error: "Request not found" });

  if (!["REQUESTED", "QUOTED"].includes(request.status)) {
    return res.status(409).json({ error: "This request can no longer be changed this way" });
  }

  if (action === "decline") {
    const updated = await prisma.commissionRequest.update({
      where: { id: request.id },
      data: { status: "DECLINED", quotedPrice: null },
    });
    return res.json(updated);
  }

  if (action === "quote") {
    const amount = Number(price);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: "Enter a valid price" });
    }
    const updated = await prisma.commissionRequest.update({
      where: { id: request.id },
      data: { status: "QUOTED", quotedPrice: amount },
    });
    return res.json(updated);
  }

  res.status(400).json({ error: "action must be quote or decline" });
});

router.post("/:id/accept", requireAuth, async (req, res) => {
  const request = await prisma.commissionRequest.findUnique({
    where: { id: req.params.id },
  });

  if (!request || request.customerId !== req.user.id) {
    return res.status(404).json({ error: "Request not found" });
  }
  if (request.status !== "QUOTED" || request.quotedPrice == null) {
    return res.status(409).json({ error: "There is no quote to accept" });
  }

  const amount = request.quotedPrice;
  const deposit = amount.mul(DEPOSIT_RATE).toDecimalPlaces(2);

  const [updated] = await prisma.$transaction([
    prisma.commissionRequest.update({
      where: { id: request.id },
      data: { status: "DEPOSIT_PENDING" },
    }),
    prisma.order.create({
      data: {
        customerId: request.customerId,
        commissionId: request.id,
        amount,
        depositAmount: deposit,
      },
    }),
  ]);

  res.json(updated);
});

const STEPS = {
  deposit_received: {
    from: "DEPOSIT_PENDING",
    to: "IN_PROGRESS",
    order: () => ({ paymentStatus: "DEPOSIT_PAID", depositPaidAt: new Date() }),
  },
  ready: {
    from: "IN_PROGRESS",
    to: "READY",
    order: () => ({}),
  },
  balance_received: {
    from: "READY",
    requires: "DEPOSIT_PAID",
    order: () => ({ paymentStatus: "PAID", balancePaidAt: new Date() }),
  },
  delivered: {
    from: "READY",
    to: "DELIVERED",
    requires: "PAID",
    order: () => ({}),
  },
};

router.post("/:id/advance", requireAuth, requireAdmin, async (req, res) => {
  const key = req.body.step;
  if (typeof key !== "string" || !Object.hasOwn(STEPS, key)) {
    return res.status(400).json({ error: "Unknown step" });
  }
  const step = STEPS[key];

  const request = await prisma.commissionRequest.findUnique({
    where: { id: req.params.id },
    include: { order: true },
  });
  if (!request?.order) return res.status(404).json({ error: "Request not found" });

  if (request.status !== step.from) {
    return res.status(409).json({ error: "That step doesn't apply at this stage" });
  }
  if (step.requires && request.order.paymentStatus !== step.requires) {
    return res.status(409).json({ error: "Record the earlier payment first" });
  }

  const [updated] = await prisma.$transaction([
    prisma.commissionRequest.update({
      where: { id: request.id },
      data: { status: step.to ?? request.status },
    }),
    prisma.order.update({ where: { id: request.order.id }, data: step.order() }),
  ]);

  res.json(updated);
});

export default router;