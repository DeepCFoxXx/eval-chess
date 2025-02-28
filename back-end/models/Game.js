const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  player: String,
  moves: [String],
  result: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Game", gameSchema);
