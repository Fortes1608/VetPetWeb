const Cliente = require("../models/clienteModel");
const Pet = require("../models/petModel");

module.exports = {
  listarClientes: async (req, res) => {
    try {
      const clientes = await Cliente.findAll({ include: Pet });
      res.json(clientes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  criarCliente: async (req, res) => {
    try {
      const { nome, telefone } = req.body;
      const novo = await Cliente.create({ nome, telefone });
      res.status(201).json(novo);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  obterCliente: async (req, res) => {
    try {
      const cliente = await Cliente.findByPk(req.params.id);
      if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });
      res.json(cliente);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  atualizarCliente: async (req, res) => {
    try {
      const cliente = await Cliente.findByPk(req.params.id);
      if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });
      
      const { nome, telefone } = req.body;
      await cliente.update({ nome, telefone });

      res.json(cliente);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deletarCliente: async (req, res) => {
    try {
      const cliente = await Cliente.findByPk(req.params.id);
      if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });
      await cliente.destroy();
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};