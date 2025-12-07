const Vacina = require("../models/vacinaModel");
const Pet = require("../models/petModel");
const Cliente = require("../models/clienteModel");
const { Op } = require("sequelize");

module.exports = {
  listar: async (req, res) => {
    try {
      const vacinas = await Vacina.findAll({
        include: {
          model: Pet,
          include: Cliente
        },
        order: [['dataProxima', 'ASC']] // Ordena pelas que vencem primeiro
      });
      res.json(vacinas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  criar: async (req, res) => {
    try {
      const { nome, dataAplicacao, dataProxima, observacoes, petId } = req.body;
      const nova = await Vacina.create({ nome, dataAplicacao, dataProxima, observacoes, petId });
      res.status(201).json(nova);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      const vacina = await Vacina.findByPk(id);
      if (!vacina) return res.status(404).json({ error: "Vacina não encontrada" });
      
      await vacina.destroy();
      res.json({ message: "Deletado com sucesso" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};