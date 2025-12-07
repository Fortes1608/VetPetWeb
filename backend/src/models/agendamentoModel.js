const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Pet = require("./petModel");

const Agendamento = sequelize.define("Agendamento", {
  data: { type: DataTypes.DATEONLY, allowNull: false },
  horario: { type: DataTypes.TIME, allowNull: false },
  servico: { type: DataTypes.STRING, allowNull: false },
  preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "Pendente" },
  observacoes: { type: DataTypes.STRING },
  petId: {
    type: DataTypes.INTEGER,
    references: { model: Pet, key: 'id' }
  }
}, { tableName: "Agendamentos", timestamps: false });

module.exports = Agendamento;