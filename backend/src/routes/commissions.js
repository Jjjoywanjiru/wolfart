import express from "express";
import prisma from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
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
    orderBy: { createdAt: "desc" },
  });
  res.json(requests);
});

export default router;