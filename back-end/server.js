import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import { aiMove } from "./controllers/aiController.js";
import { verifyToken } from "./middleware/auth.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import Game from "./models/Game.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;

dotenv.config({ path: './.env' });

connectDB();

app.use(express.json());

app.use(apiLimiter);

app.use("/auth", authRoutes);

app.post("/game", async (req, res) => {
  try {
    const newGame = new Game({
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    });

    const game = await newGame.save();

    res.json({ gameId: game._id, fen: game.fen });
  } catch (err) {
    console.error("Error creating game:", err);
    res.status(500).json({ error: "Failed to create game", details: err.message });
  }
});

app.get("/game/:id", verifyToken, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });

    res.json({ gameId: game._id, fen: game.fen });
  } catch (err) {
    res.status(500).json({ error: "Error fetching game state" });
  }
});

app.post("/game/:id/move/:level", verifyToken, async (req, res) => {
  try {
    console.log(`AI move requested for game ID: ${req.params.id} at difficulty ${req.params.level}`);

    const game = await Game.findById(req.params.id);
    if (!game) {
      console.error("Game not found");
      return res.status(404).json({ error: "Game not found" });
    }

    req.gameFen = game.fen;

    aiMove(req, res, async (newFen) => {
      game.fen = newFen;
      await game.save();
    });
  } catch (err) {
    console.error("Error processing AI move:", err);
    res.status(500).json({ error: "Error processing AI move", details: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
