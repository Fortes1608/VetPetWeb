const { Op } = require("sequelize");
const Agendamento = require("../models/agendamentoModel");
const Vacina = require("../models/vacinaModel");
const Pet = require("../models/petModel");
const Cliente = require("../models/clienteModel");
const Venda = require("../models/vendaModel");

module.exports = {
  getResumo: async (req, res) => {
    try {
      const hoje = new Date();
      const hojeStr = hoje.toISOString().split("T")[0];
      
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + 30);
      const dataLimiteStr = dataLimite.toISOString().split("T")[0];

      const vendasHoje = await Venda.sum("valor", { where: { data: hojeStr } }) || 0;
      
      const servicosHoje = await Agendamento.sum("preco", {
        where: { data: hojeStr, status: { [Op.ne]: "Cancelado" } }
      }) || 0;

      const proximosAgendamentos = await Agendamento.findAll({
        where: {
          data: hojeStr,
          status: "Pendente"
        },
        order: [["horario", "ASC"]],
        limit: 5,
        include: [{ model: Pet, include: Cliente }]
      });

      const vacinasAlerta = await Vacina.findAll({
        where: {
          dataProxima: {
            [Op.lte]: dataLimiteStr
          }
        },
        order: [["dataProxima", "ASC"]],
        limit: 5,
        include: [{ model: Pet, include: Cliente }]
      });

      res.json({
        financeiro: {
          vendas: vendasHoje,
          servicos: servicosHoje,
          total: vendasHoje + servicosHoje
        },
        agendamentos: proximosAgendamentos,
        vacinas: vacinasAlerta
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};