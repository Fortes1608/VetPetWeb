const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Venda = sequelize.define("Venda", {
  nome: { type: DataTypes.STRING, allowNull: false }, 
  categoria: { type: DataTypes.STRING, allowNull: false }, 
  quantidade: { type: DataTypes.STRING }, 
  valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  data: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW }
}, { tableName: "Vendas", timestamps: false });

module.exports = Venda;