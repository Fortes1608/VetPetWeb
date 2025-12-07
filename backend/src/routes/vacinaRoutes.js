const express = require("express");
const router = express.Router();
const vacinaController = require("../controllers/vacinaController");

router.get("/", vacinaController.listar);
router.post("/", vacinaController.criar);
router.delete("/:id", vacinaController.deletar);

module.exports = router;