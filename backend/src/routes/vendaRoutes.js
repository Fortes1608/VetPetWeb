const express = require("express");
const router = express.Router();
const vendaController = require("../controllers/vendaController");

router.get("/", vendaController.listar);
router.post("/", vendaController.criar);
router.get("/financeiro", vendaController.resumoFinanceiro);
router.delete("/:id", vendaController.deletar);

module.exports = router;