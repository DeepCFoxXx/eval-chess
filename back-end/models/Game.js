import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  fen: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
