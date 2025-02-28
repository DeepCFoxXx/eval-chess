import { Chess } from "chess.js";
import { spawn } from "child_process";

const game = new Chess();
const STOCKFISH_PATH = "/usr/local/bin/stockfish";

export const aiMove = (req, res) => {
  console.log("AI Move API called...");

  const difficulty = req.params.level || 5;
  console.log(`Requested difficulty: ${difficulty}`);

  const eloRating = 1300 + difficulty * 100;
  const engine = spawn(STOCKFISH_PATH);

  engine.stdin.write("uci\n");
  engine.stdin.write("setoption name UCI_LimitStrength value true\n");
  engine.stdin.write(`setoption name UCI_Elo value ${eloRating}\n`);
  engine.stdin.write(`position fen ${game.fen()}\n`);
  engine.stdin.write("go movetime 2000\n");

  engine.stdout.on("data", (data) => {
    console.log("Stockfish Output:", data.toString());

    const match = data.toString().match(/bestmove\s(\S+)/);
    if (match) {
      const bestMove = match[1].trim();

      if (!game.move(bestMove, { sloppy: true })) {
        console.error(`Stockfish suggested an invalid move: ${bestMove}`);
        return res.status(400).json({ error: "Invalid move from AI" });
      }

      console.log(`Best move chosen: ${bestMove}`);
      res.json({ status: "AI moved", fen: game.fen(), bestMove });
      engine.kill();
    }
  });

  engine.stderr.on("data", (data) => {
    console.error("Stockfish Error:", data.toString());
  });

  engine.on("exit", (code) => {
    console.log(`Stockfish exited with code ${code}`);
  });

  exports.analyzeMove = (req, res) => {
    const { fen } = req.body;

    engine.stdin.write(`position fen ${fen}\n`);
    engine.stdin.write("eval\n");

    engine.stdout.on("data", (data) => {
      res.json({ evaluation: data.toString() });
    });
  };

};

