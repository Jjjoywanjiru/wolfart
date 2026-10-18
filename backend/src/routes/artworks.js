import express from "express";
import prisma from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();


//FR-1, FR-4 ;  public catalog with optional category filter
router.get("/", async (req, res) => {
   const { category } = req.query;

   const artworks = await prisma.artwork.findMany({
      where: category ? { category } : {},
      orderBy: { createdAt: "desc" },
   });

   res.json(artworks);
});


//FR-2: single artwork details
router.get("/:id", async (req, res) => {
   const artwork = await prisma.artwork.findUnique({
      where: { id: req.params.id }, 
   });

   if (!artwork) {
      return res.status(404).json({ error: "Artwork not found" });
   }

   res.json(artwork);
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { title, category, medium, dimensions, materials, tools, description, price, images } = req.body;
  if (!title || !category || !medium || !dimensions || !materials || !description || price == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const artwork = await prisma.artwork.create({
    data: {
      artistId: req.user.id,
      title, category, medium, dimensions, materials, description, price,
      tools: tools ?? "",
      images: images ?? [],
    },
  });
  res.status(201).json(artwork);
});

router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  const allowed = ["title", "category", "medium", "dimensions", "materials", "tools", "description", "price", "status", "images"];
  const data = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));

  try {
    const artwork = await prisma.artwork.update({ where: { id: req.params.id }, data });
    res.json(artwork);
  } catch {
    res.status(404).json({ error: "Artwork not found" });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.artwork.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Artwork not found" });
  }
});

export default router;

