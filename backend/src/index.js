const express = require("express");
const sequelize = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

require("./models/clienteModel");
require("./models/petModel");
require("./models/agendamentoModel");
require("./models/vacinaModel");
require("./models/vendaModel"); 
require("./models/associations");


const clienteRoutes = require("./routes/clienteRoutes");
const petRoutes = require("./routes/petRoutes");
const agendamentoRoutes = require("./routes/agendamentoRoutes");
const vacinaRoutes = require("./routes/vacinaRoutes");
const vendaRoutes = require("./routes/vendaRoutes"); 
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/clientes", clienteRoutes);
app.use("/pets", petRoutes);
app.use("/agendamentos", agendamentoRoutes);
app.use("/vacinas", vacinaRoutes);
app.use("/vendas", vendaRoutes); 
app.use("/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Servidor rodando");
});

sequelize
  .sync()
  .then(() => {
    console.log("Banco sincronizado");
    app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));
  })
  .catch((err) => console.error("Erro banco:", err));