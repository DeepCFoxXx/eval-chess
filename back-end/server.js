import express from "express";
import db from "./config/database.js";
import { aiMove } from "./controllers/aiController.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Chess AI Backend is running..." });
});

app.post("/game", async (req, res) => {
  try {
    const newGame = {
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      createdAt: new Date(),
    };
    const game = await db.insert(newGame);
    res.json({ gameId: game._id, fen: game.fen });
  } catch (err) {
    res.status(500).json({ error: "Failed to create game" });
  }
});

app.get("/game/:id", async (req, res) => {
  try {
    const game = await db.findOne({ _id: req.params.id });
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json({ gameId: game._id, fen: game.fen });
  } catch (err) {
    res.status(500).json({ error: "Error fetching game state" });
  }
});

app.post("/game/:id/move/:level", async (req, res) => {
  try {
    console.log(`AI move requested for game ID: ${req.params.id} at difficulty ${req.params.level}`);

    const game = await db.findOne({ _id: req.params.id });
    if (!game) {
      console.error("Game not found");
      return res.status(404).json({ error: "Game not found" });
    }

    req.gameFen = game.fen;

    aiMove(req, res, async (newFen) => {

      await db.update({ _id: game._id }, { $set: { fen: newFen } });
    });
  } catch (err) {
    console.error("Error processing AI move:", err);
    res.status(500).json({ error: "Error processing AI move", details: err.message });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
