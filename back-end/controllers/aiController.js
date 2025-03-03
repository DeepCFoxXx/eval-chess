import { Chess } from "chess.js";
import { exec } from "child_process";

const STOCKFISH_PATH = "/usr/local/bin/stockfish";

export const aiMove = (req, res, updateGame) => {

  const difficulty = req.params.level || 5;

  const game = new Chess(req.gameFen);
  const engine = exec(STOCKFISH_PATH);

  engine.stdin.write("uci\n");
  engine.stdin.write(`position fen ${game.fen()}\n`);
  engine.stdin.write(`go depth ${difficulty}\n`);

  engine.stdout.on("data", (data) => {

    const match = data.match(/bestmove\s(\S+)/);
    if (match) {
      const bestMove = match[1].trim();

      if (!game.move(bestMove, { sloppy: true })) {
        console.error(`Stockfish suggested an invalid move: ${bestMove}`);
        return res.status(400).json({ error: "Invalid move from AI" });
      }

      updateGame(game.fen());
      res.json({ status: "AI moved", fen: game.fen(), bestMove });

      engine.kill();
    }
  });

  engine.stderr.on("data", (data) => {
    console.error("Stockfish Error:", data);
  });

  engine.on("exit", (code) => {
    console.log(`Stockfish exited with code ${code}`);
  });
};
