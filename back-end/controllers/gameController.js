const Game = require("../models/Game");

exports.saveGame = async (req, res) => {
  try {
    const newGame = new Game(req.body);
    await newGame.save();
    res.json({ status: "Game saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save game" });
  }
};

exports.makeMove = (req, res) => {
  const { move } = req.body;
  const result = game.move(move, { sloppy: true });

  if (result) {
    res.json({ status: "Move successful", fen: game.fen() });
  } else {
    res.status(400).json({ error: "Invalid move" });
  }
};

exports.validateMove = (req, res) => {
  const { move } = req.body;
  if (game.move(move, { sloppy: true })) {
    res.json({ valid: true, newFen: game.fen() });
  } else {
    res.json({ valid: false, error: "Invalid move" });
  }
};

exports.exportPGN = (req, res) => {
  res.json({ pgn: game.pgn() });
};
