import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Pets.module.css";
import { Pencil, Trash2, Search, X } from "lucide-react";

const API_URL = "http://localhost:3000/pets";

const PET_SPECIES = [
    { label: "Cão", value: "Cão" },
    { label: "Gato", value: "Gato" },
    { label: "Outro", value: "Outro" },
];

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    especie: "",
    raca: "",
    idade: "",
    clienteId: null
  });

  const fetchPets = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Falha ao buscar pets");
      const data = await response.json();
      setPets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este pet?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Erro ao deletar");
        setPets(pets.filter((pet) => pet.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleEditClick = (pet) => {
    setEditingPet(pet);
    setFormData({
      nome: pet.nome,
      especie: pet.especie,
      raca: pet.raca,
      idade: pet.idade,
      clienteId: pet.clienteId
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${editingPet.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erro ao atualizar");
      
      const updatedPetData = await response.json();
      const originalPet = pets.find(p => p.id === editingPet.id);
      const petComCliente = { 
        ...updatedPetData, 
        Cliente: originalPet.Cliente 
      };

      setPets(pets.map((p) => (p.id === editingPet.id ? petComCliente : p)));
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredPets = pets.filter((pet) => {
    const searchLower = searchTerm.toLowerCase();
    const petNameMatch = pet.nome.toLowerCase().includes(searchLower);
    const ownerNameMatch = pet.Cliente?.nome.toLowerCase().includes(searchLower);
    return petNameMatch || ownerNameMatch;
  });

  if (loading) return <div className={styles.pageContainer}><p>Carregando...</p></div>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestão de Pets</h1>
        
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Buscar por pet ou dono..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Espécie / Raça</th>
              <th>Idade</th>
              <th>Dono (Cliente)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPets.map((pet) => (
              <tr key={pet.id}>
                <td>
                  <Link to={`/pets/${pet.id}`} className={styles.ownerLink} style={{fontSize: '16px'}}>
                    {pet.nome}
                  </Link>
                </td>
                <td>{pet.especie} - {pet.raca}</td>
                <td>{pet.idade} anos</td>
                <td>
                  {pet.Cliente ? (
                    <Link to={`/clientes/${pet.Cliente.id}`} className={styles.ownerLink}>
                      {pet.Cliente.nome}
                    </Link>
                  ) : (
                    <span style={{color: '#999'}}>Sem dono</span>
                  )}
                </td>
                <td className={styles.actions}>
                  <button className={styles.actionButton} onClick={() => handleEditClick(pet)}>
                    <Pencil />
                  </button>
                  <button className={styles.actionButton} onClick={() => handleDelete(pet.id)}>
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Editar Pet</h2>
              <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <form className={styles.form} onSubmit={handleUpdate}>
              <div className={styles.formGroup}>
                <label>Nome</label>
                <input name="nome" value={formData.nome} onChange={handleInputChange} required />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className={styles.formGroup}>
                  <label>Espécie</label>
                  <select name="especie" value={formData.especie} onChange={handleInputChange} className={styles.selectField}>
                     {PET_SPECIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Idade</label>
                  <input name="idade" type="number" value={formData.idade} onChange={handleInputChange} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Raça</label>
                <input name="raca" value={formData.raca} onChange={handleInputChange} />
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className={styles.submitButton}>Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}