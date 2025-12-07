import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ClienteDetalhe.module.css";
import { User, PawPrint, Plus, ArrowLeft, X } from "lucide-react";

const API_BASE = "http://localhost:3000";

// 🐾 Dados para Seleção (Você pode expandir isso)
const PET_SPECIES = [
    { label: "Cão", value: "Cão" },
    { label: "Gato", value: "Gato" },
    { label: "Outro", value: "Outro" },
];

const PET_BREEDS = {
    "Cão": [
        "SRD (Vira-Lata)", 
        "Akita", 
        "American Bully",
        "Basset Hound", 
        "Beagle", 
        "Bernese",
        "Border Collie", 
        "Boxer", 
        "Bulldog Francês", 
        "Bulldog Inglês", 
        "Bull Terrier",
        "Cane Corso",
        "Chihuahua", 
        "Chow Chow", 
        "Cocker Spaniel", 
        "Dachshund (Salsicha)", 
        "Dálmata", 
        "Doberman", 
        "Fox Paulistinha",
        "Golden Retriever", 
        "Husky Siberiano", 
        "Labrador Retriever", 
        "Lhasa Apso", 
        "Maltês", 
        "Mastiff",
        "Pastor Alemão", 
        "Pastor Belga",
        "Pinscher", 
        "Pit Bull", 
        "Poodle", 
        "Pug", 
        "Rottweiler", 
        "Samoieda",
        "São Bernardo",
        "Schnauzer", 
        "Shar-pei",
        "Shih Tzu", 
        "Spitz Alemão (Lulu)", 
        "Staffordshire Bull Terrier",
        "Weimaraner",
        "Yorkshire Terrier", 
        "Outra"
    ],
    "Gato": [
        "SRD (Sem Raça Definida)", 
        "Abissínio",
        "American Shorthair",
        "Angorá", 
        "Bengal", 
        "Bombay",
        "British Shorthair", 
        "Burmês",
        "Exótico",
        "Himalaio", 
        "Maine Coon", 
        "Munchkin",
        "Norueguês da Floresta",
        "Persa", 
        "Ragdoll", 
        "Russian Blue",
        "Scottish Fold",
        "Siamês", 
        "Siberiano", 
        "Sphynx", 
        "Outra"
    ],
    "Outro": [
        "Coelho", 
        "Hamster", 
        "Porquinho da Índia", 
        "Chinchila", 
        "Furão", 
        "Ave/Pássaro", 
        "Réptil", 
        "Peixe", 
        "Outra"
    ],
};

export default function ClienteDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [client, setClient] = useState(null);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [petForm, setPetForm] = useState({
        nome: "",
        especie: "Cão", 
        raca: "Vira-Lata", 
        idade: "",
    });


    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const clientRes = await fetch(`${API_BASE}/clientes/${id}`);
                if (!clientRes.ok) throw new Error("Cliente não encontrado");
                const clientData = await clientRes.json();
                setClient(clientData);

                const petsRes = await fetch(`${API_BASE}/clientes/${id}/pets`);
                if (petsRes.ok) {
                    const petsData = await petsRes.json();
                    setPets(petsData);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [id]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPetForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSpeciesChange = (e) => {
        const newSpecies = e.target.value;
        const defaultBreed = PET_BREEDS[newSpecies] ? PET_BREEDS[newSpecies][0] : "";
        
        setPetForm((prev) => ({
            ...prev,
            especie: newSpecies,
            raca: defaultBreed 
        }));
    };

 
    const handleAddPet = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...petForm,
                clienteId: id,
                idade: petForm.idade ? parseInt(petForm.idade) : null
            };

            const response = await fetch(`${API_BASE}/pets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Erro ao adicionar pet");

            const newPet = await response.json();
            
            setPets((prev) => [...prev, newPet]);
            setIsModalOpen(false);
            setPetForm({ nome: "", especie: "Cão", raca: "Vira-Lata", idade: "" }); // Reset com padrão
        } catch (err) {
            alert(`Erro: ${err.message}. Verifique se o backend está rodando.`);
        }
    };

    
    if (loading) return <div className={styles.pageContainer}><p>Carregando...</p></div>;
    if (error) return <div className={styles.pageContainer}><p>Erro: {error}</p></div>;
    if (!client) return <div className={styles.pageContainer}><p>Cliente não encontrado.</p></div>;

    return (
        <div className={styles.pageContainer}>
            <main className={styles.content}>
                
              
                <div className={styles.header}>
                    <h1 className={styles.title}>{client.nome}</h1>
                    <button className={styles.backButton} onClick={() => navigate("/clientes")}>
                        <ArrowLeft size={18} />
                        Voltar
                    </button>
                </div>

                <div className={styles.detailsGrid}>
                    
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <User size={22} />
                            Informações do Cliente
                        </h2>
                        <div className={styles.infoRow}>
                            <label>Nome Completo</label>
                            <p>{client.nome}</p>
                        </div>
                        <div className={styles.infoRow}>
                            <label>Telefone</label>
                            <p>{client.telefone}</p>
                        </div>
                    </div>

                
                    <div className={styles.card}>
                        <div className={styles.petHeader}>
                            <h2 className={styles.cardTitle}>
                                <PawPrint size={22} />
                                Pets
                            </h2>
                            <button 
                                className={styles.addPetButton}
                                onClick={() => setIsModalOpen(true)}
                            >
                                <Plus size={16} />
                                Adicionar Pet
                            </button>
                        </div>
                        
                        <div className={styles.petList}>
                            {pets.length > 0 ? (
                                pets.map((pet) => (
                                    <div key={pet.id} className={styles.petItem}>
                                        <p><strong>{pet.nome}</strong></p>
                                        <p style={{ fontSize: '14px', color: '#666' }}>
                                            {pet.especie} • {pet.raca} • {pet.idade} anos
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.noPetsMessage}>
                                    Nenhum pet cadastrado.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                
                {isModalOpen && (
                    <div className={styles.modalBackdrop}>
                        <div className={styles.modalContent}>
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>Adicionar Pet</h2>
                                <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>

                            <form className={styles.form} onSubmit={handleAddPet}>
                                <div className={styles.formGroup}>
                                    <label>Nome do Pet *</label>
                                    <input 
                                        name="nome" 
                                        value={petForm.nome} 
                                        onChange={handleInputChange} 
                                        required 
                                    />
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className={styles.formGroup}>
                                        <label>Espécie *</label>
                                        <select
                                            name="especie"
                                            value={petForm.especie}
                                            onChange={handleSpeciesChange} 
                                            className={styles.selectField}
                                            required
                                        >
                                            {PET_SPECIES.map((s) => (
                                                <option key={s.value} value={s.value}>
                                                    {s.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Idade (anos)</label>
                                        <input 
                                            name="idade" 
                                            type="number"
                                            value={petForm.idade} 
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                </div>

                        
                                <div className={styles.formGroup}>
                                    <label>Raça</label>
                                    <select
                                        name="raca"
                                        value={petForm.raca}
                                        onChange={handleInputChange}
                                        className={styles.selectField}
                                    >
                                        
                                        {PET_BREEDS[petForm.especie] && PET_BREEDS[petForm.especie].map((raca) => (
                                            <option key={raca} value={raca}>
                                                {raca}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formActions}>
                                    <button type="button" className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className={styles.submitButton}>
                                        Salvar Pet
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}