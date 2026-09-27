import dotenv from "dotenv";
import express from "express";

const environment = process.env.NODE_ENV || "development";
dotenv.config();
dotenv.config({ path: `.env.${environment}`, override: true });

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
