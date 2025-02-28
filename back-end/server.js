import express from "express";
import mongoose from "mongoose";
import { aiMove } from "./controllers/aiController.js";
import Game from "./models/Game.js";

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/chess";

app.use(express.json());

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.post("/game", async (req, res) => {
  try {
    const newGame = new Game({ fen: "start" });
    await newGame.save();
    res.json({ gameId: newGame._id, fen: newGame.fen });
  } catch (err) {
    res.status(500).json({ error: "Failed to create game" });
  }
});

app.get("/game/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json({ gameId: game._id, fen: game.fen });
  } catch (err) {
    res.status(500).json({ error: "Error fetching game state" });
  }
});


app.post("/game/:id/move/:level", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });

    req.gameFen = game.fen;
    aiMove(req, res, async (newFen) => {
      game.fen = newFen;
      await game.save();
    });
  } catch (err) {
    res.status(500).json({ error: "Error processing AI move" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
