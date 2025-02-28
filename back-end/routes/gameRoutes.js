const express = require("express");
const { saveGame } = require("../controllers/gameController");
const router = express.Router();

router.post("/save", saveGame);
router.post("/move", makeMove);
router.post("/analyze", analyzeMove);
router.post("/validate", validateMove);
router.get("/export-pgn", exportPGN);

module.exports = router;
