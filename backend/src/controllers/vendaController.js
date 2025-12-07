const Venda = require("../models/vendaModel");
const Agendamento = require("../models/agendamentoModel");
const { Op } = require("sequelize");

module.exports = {
  listar: async (req, res) => {
    try {
      const vendas = await Venda.findAll({ order: [['data', 'DESC']] });
      res.json(vendas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  criar: async (req, res) => {
    try {
      const { nome, categoria, quantidade, valor, data } = req.body;
      const nova = await Venda.create({ nome, categoria, quantidade, valor, data });
      res.status(201).json(nova);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      await Venda.destroy({ where: { id } });
      res.json({ message: "Deletado" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  resumoFinanceiro: async (req, res) => {
    try {
      const hoje = new Date().toISOString().split('T')[0];

      const vendasHoje = await Venda.sum('valor', { where: { data: hoje } }) || 0;
      
      const servicosHoje = await Agendamento.sum('preco', { 
        where: { data: hoje, status: { [Op.ne]: 'Cancelado' } } 
      }) || 0;

      res.json({
        vendasHoje,
        servicosHoje,
        totalGeralHoje: vendasHoje + servicosHoje
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};