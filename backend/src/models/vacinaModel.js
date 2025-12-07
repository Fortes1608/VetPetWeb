const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Pet = require("./petModel");

const Vacina = sequelize.define("Vacina", {
  nome: { type: DataTypes.STRING, allowNull: false },
  dataAplicacao: { type: DataTypes.DATEONLY, allowNull: false },
  dataProxima: { type: DataTypes.DATEONLY, allowNull: false }, // Data do reforço
  observacoes: { type: DataTypes.STRING },
  petId: {
    type: DataTypes.INTEGER,
    references: { model: Pet, key: 'id' }
  }
}, { tableName: "Vacinas", timestamps: false });

module.exports = Vacina;