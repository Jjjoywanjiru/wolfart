import express from "express";
import prisma from "../db.js";

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

export default router;

