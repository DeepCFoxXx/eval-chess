import { Chess } from 'chess.js';

const game = new Chess();

export const getGameState = (req, res) => {
  res.json({ fen: game.fen(), moves: game.moves() });
};

export const makeMove = (req, res) => {
  const { move } = req.body;
  const result = game.move(move);
  if (result) {
    res.json({ status: 'success', fen: game.fen() });
  } else {
    res.status(400).json({ error: 'Invalid move' });
  }
};
