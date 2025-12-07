const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Cliente = require("./clienteModel");

const Pet = sequelize.define("Pet", {
  nome: { type: DataTypes.STRING, allowNull: false },
  especie: { type: DataTypes.STRING },
  raca: { type: DataTypes.STRING },
  idade: { type: DataTypes.INTEGER },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cliente, 
      key: 'id'       
    }
  }
},
{
  tableName: "Pets",
  timestamps: false,
}
);

module.exports = Pet;
