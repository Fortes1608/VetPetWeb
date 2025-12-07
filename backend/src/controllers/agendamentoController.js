const Agendamento = require("../models/agendamentoModel");
const Pet = require("../models/petModel");
const Cliente = require("../models/clienteModel");

module.exports = {
  listar: async (req, res) => {
    try {
      const agendamentos = await Agendamento.findAll({
        include: {
          model: Pet,
          include: Cliente 
        },
        order: [['data', 'ASC'], ['horario', 'ASC']]
      });
      res.json(agendamentos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  criar: async (req, res) => {
    try {
      const { data, horario, servico, preco, observacoes, petId } = req.body;
      const novo = await Agendamento.create({ data, horario, servico, preco, observacoes, petId });
      res.status(201).json(novo);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  atualizarStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; 
      const agendamento = await Agendamento.findByPk(id);
      
      if (!agendamento) return res.status(404).json({ error: "Agendamento não encontrado" });
      
      await agendamento.update({ status });
      res.json(agendamento);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      const agendamento = await Agendamento.findByPk(id);
      if (!agendamento) return res.status(404).json({ error: "Agendamento não encontrado" });
      
      await agendamento.destroy();
      res.json({ message: "Deletado com sucesso" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};