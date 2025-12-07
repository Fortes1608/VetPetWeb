import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Clientes.module.css";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";

const API_URL = "http://localhost:3000/clientes";

export default function Clientes() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
  });

  const fetchClients = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Falha ao buscar clientes");
      const data = await response.json();
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este cliente? Isso pode apagar os pets associados.");
    
    if (confirmDelete) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Erro ao deletar");

        setClients(clients.filter((client) => client.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setFormData({
      nome: client.nome,
      telefone: client.telefone,
    });
    setIsModalOpen(true);
  };

  const openModal = () => {
    setEditingId(null);
    setFormData({ nome: "", telefone: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ nome: "", telefone: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      let result;

      if (editingId) {
        response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Erro ao atualizar");
        result = await response.json();

        setClients(clients.map((c) => (c.id === editingId ? result : c)));

      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Erro ao criar");
        result = await response.json();

        setClients([...clients, result]);
      }

      closeModal();

    } catch (err) {
      alert(err.message);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className={styles.pageContainer}><p>Carregando...</p></div>;
  if (error) return <div className={styles.pageContainer}><p>Erro: {error}</p></div>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestão de Clientes</h1>
        
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Pesquisar cliente..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className={styles.addButton} onClick={openModal}>
          <Plus size={20} />
          Adicionar Cliente
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Pets</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td>
                  <Link to={`/clientes/${client.id}`} className={styles.clientLink}>
                    {client.nome}
                  </Link>
                </td>
                <td>
                  {client.Pets && client.Pets.length > 0 ? (
                    client.Pets.map((pet) => (
                      <span key={pet.id} className={styles.petTag}>
                        {pet.nome}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "13px" }}>
                      Sem pets
                    </span>
                  )}
                </td>
                <td>{client.telefone}</td>
                <td className={styles.actions}>
                  <button className={styles.actionButton} onClick={() => handleEdit(client)}>
                    <Pencil />
                  </button>
                  <button className={styles.actionButton} onClick={() => handleDelete(client.id)}>
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
              <h2 className={styles.modalTitle}>
                {editingId ? "Editar Cliente" : "Adicionar Novo Cliente"}
              </h2>
              <button className={styles.closeButton} onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="text"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingId ? "Salvar Alterações" : "Criar Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}