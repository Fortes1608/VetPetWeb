import { useState, useEffect } from "react";
import styles from "./Vacinas.module.css";
import { Plus, Trash2, AlertTriangle, X } from "lucide-react";
import { format, parseISO, differenceInDays, isPast, isSameDay } from "date-fns";
import DatePickerInput from "../components/DatePickerInput";

const API_BASE = "http://localhost:3000";

const VACINAS_COMUNS = [
  "Raiva (Antirrábica)", "V8 / V10 (Polivalente)", "Giúrdia", "Tosse dos Canis", "V4 / V5 (Felina)"
];

export default function Vacinas() {
  const [vacinas, setVacinas] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    petId: "", nome: "", dataAplicacao: "", dataProxima: "", observacoes: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vacRes, petsRes] = await Promise.all([
        fetch(`${API_BASE}/vacinas`),
        fetch(`${API_BASE}/pets`)
      ]);
      
      const vacData = await vacRes.json();
      const petsData = await petsRes.json();

      if (Array.isArray(vacData)) setVacinas(vacData);
      else setVacinas([]);

      if (Array.isArray(petsData)) setPets(petsData);

    } catch (error) {
      console.error(error);
      setVacinas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/vacinas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ petId: "", nome: "", dataAplicacao: "", dataProxima: "", observacoes: "" });
        fetchData();
      }
    } catch (error) { alert("Erro ao salvar."); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apagar registro de vacina?")) {
      await fetch(`${API_BASE}/vacinas/${id}`, { method: "DELETE" });
      setVacinas(vacinas.filter(v => v.id !== id));
    }
  };

  const getStatus = (date) => {
    const nextDate = parseISO(date);
    const today = new Date();
    const daysLeft = differenceInDays(nextDate, today);

    if (isPast(nextDate) && !isSameDay(nextDate, today)) return { label: "Atrasada", class: "expired", colorClass: "textExpired", pill: "pillExpired" };
    if (daysLeft <= 30) return { label: "Vence em breve", class: "warning", colorClass: "textWarning", pill: "pillWarning" };
    return { label: "Em dia", class: "ok", colorClass: "textOk", pill: "pillOk" };
  };

  const alerts = vacinas.filter(v => {
    const status = getStatus(v.dataProxima);
    return status.class === "expired" || status.class === "warning";
  });

  if (loading) return <div className={styles.pageContainer}><p>Carregando...</p></div>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Controle de Vacinas</h1>
        <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Nova Vacina
        </button>
      </div>

      {alerts.length > 0 && (
        <div className={styles.alertsSection}>
          <h2 className={styles.sectionTitle}>
            <AlertTriangle size={20} color="#f59e0b" />
            Atenção Necessária
          </h2>
          <div className={styles.alertsGrid}>
            {alerts.map((v) => {
              const status = getStatus(v.dataProxima);
              return (
                <div key={v.id} className={`${styles.alertCard} ${styles[status.class]}`}>
                  <div className={styles.alertInfo}>
                    <h4>{v.Pet?.nome} ({v.nome})</h4>
                    <p>Dono: {v.Pet?.Cliente?.nome}</p>
                  </div>
                  <div className={`${styles.alertDate} ${styles[status.colorClass]}`}>
                    {format(parseISO(v.dataProxima), "dd/MM/yyyy")}
                    <span>{status.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Pet / Dono</th>
              <th>Vacina</th>
              <th>Aplicada em</th>
              <th>Próxima Dose</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {vacinas.map((v) => {
              const status = getStatus(v.dataProxima);
              return (
                <tr key={v.id}>
                  <td>
                    <strong>{v.Pet?.nome}</strong><br />
                    <span style={{fontSize:'12px', color:'#666'}}>{v.Pet?.Cliente?.nome}</span>
                  </td>
                  <td>{v.nome}</td>
                  <td>{format(parseISO(v.dataAplicacao), "dd/MM/yyyy")}</td>
                  <td>{format(parseISO(v.dataProxima), "dd/MM/yyyy")}</td>
                  <td>
                    <span className={`${styles.statusPill} ${styles[status.pill]}`}>
                      {status.label}
                    </span>
                  </td>
                  <td>
                    <button className={styles.deleteButton} onClick={() => handleDelete(v.id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Registrar Vacina</h2>
              <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            <form className={styles.form} onSubmit={handleCreate}>
              <div className={styles.formGroup}>
                <label>Pet</label>
                <select className={styles.selectField} required value={formData.petId} onChange={e => setFormData({...formData, petId: e.target.value})}>
                  <option value="">Selecione...</option>
                  {pets.map(p => <option key={p.id} value={p.id}>{p.nome} (Dono: {p.Cliente?.nome})</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Vacina</label>
                <input list="vacinasList" className={styles.selectField} required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} placeholder="Digite ou selecione..." />
                <datalist id="vacinasList">
                  {VACINAS_COMUNS.map(v => <option key={v} value={v} />)}
                </datalist>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div className={styles.formGroup}>
                  <label>Data Aplicação</label>
                  <DatePickerInput 
                    selected={formData.dataAplicacao} 
                    onChange={(date) => setFormData({ ...formData, dataAplicacao: date })} 
                    placeholder="Selecione"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Próxima Dose</label>
                  <DatePickerInput 
                    selected={formData.dataProxima} 
                    onChange={(date) => setFormData({ ...formData, dataProxima: date })} 
                    placeholder="Selecione"
                    required
                  />
                </div>
              </div>
              <button type="submit" className={styles.submitButton}>Salvar Registro</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}