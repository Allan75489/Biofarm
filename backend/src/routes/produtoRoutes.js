import express from "express";
import { listarProdutos, criarProduto } from "../controllers/produtoController.js";

const router = express.Router();

router.get("/", listarProdutos);
router.post("/", criarProduto);

export default router;