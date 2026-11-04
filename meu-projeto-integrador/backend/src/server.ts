import express from "express";
import { port } from "./config/env";
import { corsMiddleware } from "./middleware/cors";
import { authRouter } from "./routes/auth.routes";
import { adminRouter } from "./routes/admin.routes";
import { productsRouter } from "./routes/products.routes";

const app = express();

app.use(express.json({ limit: "8mb" }));
app.use(corsMiddleware);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/products", productsRouter);

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
