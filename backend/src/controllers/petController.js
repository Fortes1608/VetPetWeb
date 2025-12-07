const Pet = require("../models/petModel");
const Cliente = require("../models/clienteModel");
const Agendamento = require("../models/agendamentoModel");
const Vacina = require("../models/vacinaModel");

const petController = {
  async listar(req, res) {
    try {
      const pets = await Pet.findAll({ include: Cliente });
      res.json(pets);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar pets" });
    }
  },

  async criar(req, res) {
    try {
      const { nome, especie, raca, idade, clienteId } = req.body;
      const novoPet = await Pet.create({ nome, especie, raca, idade, clienteId });
      res.status(201).json(novoPet);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar pet" });
    }
  },
  
  async obter(req, res) {
    try {
      const { id } = req.params;
      const pet = await Pet.findByPk(id, {
        include: [
          { model: Cliente },
          { model: Agendamento },
          { model: Vacina }
        ]
      });

      if (!pet) return res.status(404).json({ error: "Pet não encontrado" });
      res.json(pet);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar detalhes do pet: " + error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, especie, raca, idade, clienteId } = req.body;
      const pet = await Pet.findByPk(id);
      
      if (!pet) return res.status(404).json({ error: "Pet não encontrado" });

      await pet.update({ nome, especie, raca, idade, clienteId });
      res.json(pet);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar pet" });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const pet = await Pet.findByPk(id);
      
      if (!pet) return res.status(404).json({ error: "Pet não encontrado" });

      await pet.destroy();
      res.json({ message: "Pet excluído com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao excluir pet" });
    }
  },

  async listarPetDosClientes(req, res) { 
    try {
      const { id } = req.params; 
      const pets = await Pet.findAll({ where: { clienteId: id } });
      res.json(pets || []); 
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = petController;