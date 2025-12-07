import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PetDetalhe.module.css";
import { ArrowLeft, Calendar, Syringe, History, Clock } from "lucide-react";
import { format, parseISO, isPast, isFuture, compareDesc, compareAsc } from "date-fns";
import { ptBR } from "date-fns/locale";

const API_BASE = "http://localhost:3000";

export default function PetDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await fetch(`${API_BASE}/pets/${id}`);
        if (!response.ok) throw new Error("Erro");
        const data = await response.json();
        setPet(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  if (loading) return <div className={styles.pageContainer}><p>Carregando...</p></div>;
  if (!pet) return <div className={styles.pageContainer}><p>Pet não encontrado.</p></div>;
  
  const allAppointments = pet.Agendamentos || [];
  const futureAppointments = allAppointments
    .filter(a => isFuture(parseISO(a.data + 'T' + a.horario)))
    .sort((a, b) => compareAsc(parseISO(a.data), parseISO(b.data)));

  const pastAppointments = allAppointments
    .filter(a => isPast(parseISO(a.data + 'T' + a.horario)))
    .sort((a, b) => compareDesc(parseISO(a.data), parseISO(b.data)));

  const vaccines = (pet.Vacinas || []).sort((a, b) => compareDesc(parseISO(a.dataAplicacao), parseISO(b.dataAplicacao)));

  const formatDate = (date) => format(parseISO(date), "dd/MM/yyyy");

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
          <button className={styles.backButton} onClick={() => navigate("/pets")}>
            <ArrowLeft size={20} /> Voltar
          </button>
          <h1 className={styles.title}>{pet.nome}</h1>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.infoCard}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Tutor</span>
            <span className={styles.value}>{pet.Cliente?.nome || "Sem tutor"}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Espécie / Raça</span>
            <span className={styles.value}>{pet.especie} - {pet.raca}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Idade</span>
            <span className={styles.value}>{pet.idade} anos</span>
          </div>
        </div>
        <div className={styles.historySection}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}><Clock size={20}/> Próximos Agendamentos</span>
            </div>
            {futureAppointments.length > 0 ? (
              <ul className={styles.listContainer}>
                {futureAppointments.map(a => (
                  <li key={a.id} className={`${styles.listItem} ${styles.futureItem}`}>
                    <div>
                      <div className={styles.itemDate}>
                        {formatDate(a.data)} às {a.horario.slice(0,5)}
                      </div>
                      <div className={styles.itemService}>{a.servico}</div>
                    </div>
                    <span className={`${styles.itemStatus} ${styles.statusPendente}`}>
                      Agendado
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{padding:20, color:'#999'}}>Nenhum agendamento futuro.</p>
            )}
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}><Syringe size={20}/> Carteira de Vacinação</span>
            </div>
            <div className={`${styles.vaccineRow} ${styles.vaccineHeader}`}>
              <span>Vacina</span>
              <span>Aplicada em</span>
              <span>Reforço</span>
            </div>
            {vaccines.length > 0 ? (
              <div className={styles.scrollableList} style={{maxHeight:'200px'}}>
                {vaccines.map(v => (
                  <div key={v.id} className={styles.vaccineRow}>
                    <span style={{fontWeight:500}}>{v.nome}</span>
                    <span>{formatDate(v.dataAplicacao)}</span>
                    <span style={{color: isPast(parseISO(v.dataProxima)) ? 'red' : 'green'}}>
                      {formatDate(v.dataProxima)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{padding:20, color:'#999'}}>Nenhuma vacina registrada.</p>
            )}
          </div>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}><History size={20}/> Histórico de Serviços</span>
            </div>
            {pastAppointments.length > 0 ? (
              <ul className={`${styles.listContainer} ${styles.scrollableList}`}>
                {pastAppointments.map(a => (
                  <li key={a.id} className={styles.listItem}>
                    <div>
                      <div className={styles.itemDate}>{formatDate(a.data)}</div>
                      <div className={styles.itemService}>{a.servico}</div>
                    </div>
                    <span className={`${styles.itemStatus} ${styles['status'+a.status]}`}>
                      {a.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{padding:20, color:'#999'}}>Nenhum histórico disponível.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}