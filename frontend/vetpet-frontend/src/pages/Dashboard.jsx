import { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { DollarSign, ShoppingBag, Activity, Calendar, AlertTriangle } from "lucide-react";
import { format, parseISO, isPast, isToday } from "date-fns";

const API_BASE = "http://localhost:3000";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE}/dashboard`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  if (loading) return <div className={styles.pageContainer}><p>Carregando painel...</p></div>;
  if (!data) return <div className={styles.pageContainer}><p>Erro ao carregar dados.</p></div>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Visão Geral</h1>
        <p className={styles.subtitle}>Resumo do dia e pendências urgentes</p>
      </div>

      {/* --- Financeiro (Hoje) --- */}
      <div className={styles.financeGrid}>
        <div className={styles.financeCard}>
          <span className={styles.financeLabel}><ShoppingBag size={16}/> Vendas (Hoje)</span>
          <span className={styles.financeValue}>{formatMoney(data.financeiro.vendas)}</span>
        </div>
        <div className={styles.financeCard}>
          <span className={styles.financeLabel}><Activity size={16}/> Serviços (Hoje)</span>
          <span className={styles.financeValue}>{formatMoney(data.financeiro.servicos)}</span>
        </div>
        <div className={`${styles.financeCard} ${styles.total}`}>
          <span className={styles.financeLabel}><DollarSign size={16}/> Faturamento Total</span>
          <span className={styles.financeValue}>{formatMoney(data.financeiro.total)}</span>
        </div>
      </div>

      <div className={styles.listsGrid}>
        
        {/* --- Próximos Agendamentos --- */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}><Calendar size={20} /> Agenda do Dia</h3>
          </div>
          {data.agendamentos.length > 0 ? (
            <ul className={styles.list}>
              {data.agendamentos.map(a => (
                <li key={a.id} className={styles.listItem}>
                  <div className={styles.itemMain}>
                    <span className={styles.itemTitle}>{a.Pet?.nome} ({a.servico})</span>
                    <span className={styles.itemSub}>Tutor: {a.Pet?.Cliente?.nome}</span>
                  </div>
                  <span className={`${styles.itemBadge} ${styles.badgeTime}`}>
                    {a.horario.slice(0, 5)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.emptyState}>Sem agendamentos pendentes para hoje.</div>
          )}
        </div>

        {/* --- Alertas de Vacina --- */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}><AlertTriangle size={20} color="#f59e0b"/> Alertas de Vacinas</h3>
          </div>
          {data.vacinas.length > 0 ? (
            <ul className={styles.list}>
              {data.vacinas.map(v => {
                const expired = isPast(parseISO(v.dataProxima)) && !isToday(parseISO(v.dataProxima));
                return (
                  <li key={v.id} className={styles.listItem}>
                    <div className={styles.itemMain}>
                      <span className={styles.itemTitle}>{v.Pet?.nome} - {v.nome}</span>
                      <span className={styles.itemSub}>Tutor: {v.Pet?.Cliente?.nome}</span>
                    </div>
                    <span className={`${styles.itemBadge} ${expired ? styles.badgeAlert : styles.badgeWarning}`}>
                      {format(parseISO(v.dataProxima), "dd/MM")}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className={styles.emptyState}>Nenhuma vacina vencendo em breve.</div>
          )}
        </div>

      </div>
    </div>
  );
}