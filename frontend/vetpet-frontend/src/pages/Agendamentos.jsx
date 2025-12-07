import { useState, useEffect } from "react";
import styles from "./Agendamentos.module.css";
import { Plus, X, Check, Trash2, AlertCircle, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, addDays, isSameDay, parseISO, getDay, isWithinInterval, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import DatePickerInput from "../components/DatePickerInput";

const API_BASE = "http://localhost:3000";
const SERVICES_ENUM = ["Consulta", "Vacina", "Banho", "Tosa", "Cirurgia", "Exame"];

export default function Agendamentos() {
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("calendar");
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  
  const [formData, setFormData] = useState({
    petId: "", 
    servico: "Consulta", 
    preco: "",
    data: "", 
    horario: "", 
    observacoes: ""
  });
  
  const [availableSlots, setAvailableSlots] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schedRes, petsRes] = await Promise.all([
        fetch(`${API_BASE}/agendamentos`),
        fetch(`${API_BASE}/pets`)
      ]);

      const schedData = await schedRes.json();
      const petsData = await petsRes.json();

      if (Array.isArray(schedData)) setAppointments(schedData);
      else setAppointments([]);

      if (Array.isArray(petsData)) setPets(petsData);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const generateTimeSlots = (dateString) => {
    if (!dateString) return [];
    const date = new Date(dateString + 'T00:00:00');
    const dayOfWeek = getDay(date);
    let slots = [];
    if (dayOfWeek === 0) return []; 
    if (dayOfWeek === 6) {
      slots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
    } else {
      const morning = ["09:00", "09:30", "10:00", "10:30"];
      const afternoon = ["13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
      slots = [...morning, ...afternoon];
    }
    return slots;
  };

  useEffect(() => {
    if (formData.data) {
      const slots = generateTimeSlots(formData.data);
      setAvailableSlots(slots);
      if (formData.horario && !slots.includes(formData.horario)) {
        setFormData(prev => ({ ...prev, horario: "" }));
      }
    } else {
      setAvailableSlots([]);
    }
  }, [formData.data]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/agendamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ petId: "", servico: "Consulta", preco: "", data: "", horario: "", observacoes: "" });
        fetchData(); 
      } else {
        const errorData = await response.json();
        alert(`Erro ao criar: ${errorData.error || "Verifique os campos"}`);
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  };

  const nextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
  const prevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));
  const goToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`${API_BASE}/agendamentos/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchData();
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Cancelar este agendamento?")) {
      try {
        await fetch(`${API_BASE}/agendamentos/${id}`, { method: "DELETE" });
        setAppointments(appointments.filter(a => a.id !== id));
      } catch (error) { console.error(error); }
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Concluido') return styles.statusConcluido;
    if (status === 'Cancelado') return styles.statusCancelado;
    return styles.statusPendente;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const weeklyTotal = appointments
    .filter(a => {
      const date = parseISO(a.data);
      const start = currentWeekStart;
      const end = endOfWeek(currentWeekStart, { weekStartsOn: 0 });
      return isWithinInterval(date, { start, end }) && a.status !== 'Cancelado';
    })
    .reduce((acc, curr) => acc + Number(curr.preco || 0), 0);

  if (loading) return <div className={styles.pageContainer}><p>Carregando...</p></div>;

  return (
    <div className={styles.pageContainer}>
      
      <div className={styles.header}>
        <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
          <h1 className={styles.title}>Agenda</h1>
          <div className={styles.weekSummary}>
            <span className={styles.weekLabel}>Faturamento da Semana</span>
            <span className={styles.weekTotal}>{formatCurrency(weeklyTotal)}</span>
          </div>
        </div>
        
        <div className={styles.actionsHeader}>
          <div className={styles.toggleContainer}>
            <button 
              className={`${styles.toggleButton} ${viewMode === 'calendar' ? styles.active : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              <LayoutGrid size={18} /> Semanal
            </button>
            <button 
              className={`${styles.toggleButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} /> Lista
            </button>
          </div>

          <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
            <Plus size={20} /> Novo Agendamento
          </button>
        </div>
      </div>

      {viewMode === 'calendar' && (
        <div>
          <div className={styles.calendarControls}>
            <button className={styles.navButton} onClick={prevWeek}><ChevronLeft size={24}/></button>
            <span className={styles.currentWeekLabel}>
              {format(currentWeekStart, "MMMM yyyy", { locale: ptBR }).toUpperCase()}
            </span>
            <button className={styles.navButton} onClick={nextWeek}><ChevronRight size={24}/></button>
            <button className={styles.navButton} onClick={goToday} style={{fontSize: '12px', borderRadius: '8px'}}>Hoje</button>
          </div>

          <div className={styles.calendarGrid}>
            {weekDays.map((day) => {
              const isToday = isSameDay(day, new Date());
              const dayAppointments = appointments.filter(a => isSameDay(parseISO(a.data), day));
              
              const dayTotal = dayAppointments
                .filter(a => a.status !== 'Cancelado')
                .reduce((acc, curr) => acc + Number(curr.preco || 0), 0);

              return (
                <div key={day.toString()} className={styles.dayColumn}>
                  <div className={`${styles.dayHeader} ${isToday ? styles.today : ''}`}>
                    <span className={styles.dayName}>{format(day, "eee", { locale: ptBR })}</span>
                    <span className={styles.dayNumber}>{format(day, "d")}</span>
                  </div>
                  
                  <div className={styles.dayContent}>
                    {dayAppointments.map((appt) => (
                      <div key={appt.id} className={styles.miniCard}>
                        <span className={styles.miniTime}>{appt.horario ? appt.horario.slice(0, 5) : ''}</span>
                        <h4 className={styles.miniTitle}>{appt.Pet?.nome}</h4>
                        <p className={styles.miniSubtitle}>{appt.servico}</p>
                        <span className={styles.miniPrice}>{formatCurrency(appt.preco)}</span>
                        
                        <div style={{display:'flex', justifyContent:'flex-end', marginTop:'6px', gap:'4px'}}>
                           {appt.status === 'Pendente' && (
                             <button onClick={() => updateStatus(appt.id, 'Concluido')} 
                               style={{border:'none', background:'none', cursor:'pointer', color:'green'}}>
                               <Check size={14} />
                             </button>
                           )}
                           <button onClick={() => handleDelete(appt.id)} 
                             style={{border:'none', background:'none', cursor:'pointer', color:'red'}}>
                             <Trash2 size={14} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.dayFooter}>
                    <span className={styles.dayTotalLabel}>Total Dia</span>
                    <span className={styles.dayTotalValue}>{formatCurrency(dayTotal)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div className={styles.grid}>
          {appointments.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.dateBadge}>
                  {item.data ? new Date(item.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '--/--'}
                  <span>{item.horario ? item.horario.slice(0, 5) : '--:--'}</span>
                </div>
                <span className={`${styles.statusBadge} ${getStatusClass(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className={styles.petInfo}>
                <h3 className={styles.petName}>{item.Pet?.nome || "Pet não encontrado"}</h3>
                <p className={styles.ownerName}>
                  Dono: {item.Pet?.Cliente?.nome || "Desconhecido"}
                </p>
              </div>

              <div className={styles.serviceInfo}>
                <AlertCircle size={16} />
                {item.servico}
                <span style={{marginLeft: 'auto', fontWeight: '700', color: '#059669'}}>
                  {formatCurrency(item.preco)}
                </span>
              </div>

              <div className={styles.cardActions}>
                {item.status === 'Pendente' && (
                  <button className={`${styles.iconButton} ${styles.checkButton}`} onClick={() => updateStatus(item.id, 'Concluido')}>
                    <Check size={20} />
                  </button>
                )}
                <button className={`${styles.iconButton} ${styles.deleteButton}`} onClick={() => handleDelete(item.id)}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Novo Agendamento</h2>
              <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            
            <form className={styles.form} onSubmit={handleCreate}>
              <div className={styles.formGroup}>
                <label>Pet</label>
                <select className={styles.selectField} required value={formData.petId} onChange={e => setFormData({...formData, petId: e.target.value})}>
                  <option value="">Selecione um Pet...</option>
                  {pets.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nome} (Dono: {p.Cliente?.nome})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div className={styles.formGroup}>
                  <label>Serviço</label>
                  <select className={styles.selectField} value={formData.servico} onChange={e => setFormData({...formData, servico: e.target.value})}>
                    {SERVICES_ENUM.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Valor (R$)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    className={styles.selectField} 
                    value={formData.preco} 
                    onChange={e => setFormData({...formData, preco: e.target.value})} 
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div className={styles.formGroup}>
                  <label>Data</label>
                  <DatePickerInput 
                    selected={formData.data} 
                    onChange={(dateString) => setFormData({ ...formData, data: dateString })} 
                    placeholder="Selecione a data"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Horário</label>
                  <select
                    className={styles.selectField}
                    required
                    value={formData.horario}
                    onChange={e => setFormData({...formData, horario: e.target.value})}
                    disabled={!formData.data}
                  >
                    <option value="">
                      {!formData.data ? "Escolha a data" : availableSlots.length === 0 ? "Fechado" : "Selecione..."}
                    </option>
                    {availableSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Observações (Opcional)</label>
                <input className={styles.selectField} placeholder="Ex: Cuidado, ele morde." value={formData.observacoes} onChange={e => setFormData({...formData, observacoes: e.target.value})} />
              </div>

              <button type="submit" className={styles.submitButton}>Agendar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}