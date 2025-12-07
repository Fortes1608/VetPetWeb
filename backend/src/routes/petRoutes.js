const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");

router.get("/", petController.listar);
router.post("/", petController.criar);
router.get("/:id", petController.obter); 
router.put("/:id", petController.atualizar);
router.delete("/:id", petController.deletar);

module.exports = router;