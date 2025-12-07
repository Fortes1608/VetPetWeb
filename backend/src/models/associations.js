const Cliente = require("./clienteModel");
const Pet = require("./petModel");
const Agendamento = require("./agendamentoModel");
const Vacina = require("./vacinaModel");

Cliente.hasMany(Pet, { foreignKey: "clienteId", onDelete: "CASCADE" });
Pet.belongsTo(Cliente, { foreignKey: "clienteId" });

Pet.hasMany(Agendamento, { foreignKey: "petId", onDelete: "CASCADE" });
Agendamento.belongsTo(Pet, { foreignKey: "petId" });

Pet.hasMany(Vacina, { foreignKey: "petId", onDelete: "CASCADE" });
Vacina.belongsTo(Pet, { foreignKey: "petId" });

module.exports = { Cliente, Pet, Agendamento, Vacina };