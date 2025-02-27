import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import chessRoutes from "./routes/chessRoutes.js";

dotenv.config();
const app = express();

const MONGO_URI = process.env.MONGO_URI || "your-mongodb-connection-string";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use("/api", chessRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
