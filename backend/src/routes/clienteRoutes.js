const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const petController = require("../controllers/petController");

router.get("/", clienteController.listarClientes);
router.post("/", clienteController.criarCliente);
router.get("/:id", clienteController.obterCliente);
router.put("/:id", clienteController.atualizarCliente);
router.delete("/:id", clienteController.deletarCliente);
router.get("/:id/pets", petController.listarPetDosClientes);

module.exports = router;
