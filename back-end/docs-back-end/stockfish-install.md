# Install, Run, and Integrate Stockfish with Node.js

This guide will walk you through installing Stockfish using Homebrew, running it, and integrating it into a Node.js backend.

---

## **1. Installing Stockfish (MacOS)**

To install Stockfish using Homebrew, run:

```sh
brew install stockfish
```

To verify the installation, run:

```sh
stockfish
```

You should see the Stockfish engine start with some introductory text. Type `quit` to exit.

---

## **2. Finding the Stockfish Path**

To locate the Stockfish binary path, use:

```sh
which stockfish
```

This will return a path like:

```
/usr/local/bin/stockfish
```

Use this path when configuring your Node.js application.

---

## **3. Running Stockfish from Node.js**

### **3.1 Install Dependencies**

Ensure your project has the required packages:

```sh
npm install chess.js child_process
```

### **3.2 Modify Your AI Controller**

In your `aiController.js`, update the Stockfish integration:

```javascript
import { spawn } from "child_process";
import { Chess } from "chess.js";

const game = new Chess();
const STOCKFISH_PATH = "/usr/local/bin/stockfish";

export const getAIMove = (req, res) => {
    const difficulty = req.params.level || 5;
    const engine = spawn(STOCKFISH_PATH);

    engine.stdin.write("uci\n");
    engine.stdin.write("ucinewgame\n");
    engine.stdin.write(`position fen ${game.fen()}\n`);
    engine.stdin.write(`go depth ${difficulty}\n`);

    engine.stdout.on("data", (data) => {
        console.log("Stockfish Output:", data.toString());

        const match = data.toString().match(/bestmove\s(\S+)/);
        if (match) {
            const bestMove = match[1].trim();
            game.move(bestMove, { sloppy: true });
            res.json({ status: "AI moved", fen: game.fen(), bestMove });
            engine.kill();
        }
    });
};
```

### **3.3 Update Express API**

In `server.js`, add the AI route:

```javascript
import express from "express";
import { getAIMove } from "./controllers/aiController.js";

const app = express();
app.get("/api/ai/:level", getAIMove);

app.listen(5001, () => console.log("Server running on port 5001"));
```

---

## **4. Running the API**

Start the backend server:

```sh
npm run dev
```

Test the AI move endpoint:

```sh
curl http://localhost:5001/api/ai/5
```

Expected response:

```json
{
  "status": "AI moved",
  "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
  "bestMove": "e2e4"
}
```

---

## **5. Debugging Issues**

### **Issue: Stockfish Not Found**

If you see an error like `Error: spawn /usr/local/bin/stockfish ENOENT`, update `STOCKFISH_PATH` to match the output of `which stockfish`.

### **Issue: Invalid Move**

Ensure the move is extracted correctly:

```javascript
const match = data.toString().match(/bestmove\s(\S+)/);
```

If Stockfish is suggesting illegal moves, try adjusting depth or multiPV settings.
