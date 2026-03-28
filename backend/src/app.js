import express from "express";
import produtoRoutes from "./routes/produtoRoutes.js";

const app = express();

// Middleware para JSON
app.use(express.json());

// Rotas
app.use("/produtos", produtoRoutes);

export default app;