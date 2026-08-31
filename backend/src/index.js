import "dotenv/config";
import express from "express";
import cors from "cors";
import artworkRoutes from "./routes/artworks.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/artworks", artworkRoutes);

app.get("/health", (req, res) => {
   res.json({ status: "ok" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));