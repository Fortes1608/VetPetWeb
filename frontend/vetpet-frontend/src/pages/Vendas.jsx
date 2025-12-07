import { useState, useEffect } from "react";
import styles from "./Vendas.module.css";
import { Trash2, DollarSign, ShoppingBag, Activity } from "lucide-react";
import DatePickerInput from "../components/DatePickerInput";

const API_BASE = "http://localhost:3000";

const CATEGORIAS = ["Racao", "Acessorios", "Medicamentos"];

export default function Vendas() {
  const [vendas, setVendas] = useState([]);
  const [resumo, setResumo] = useState({ vendasHoje: 0, servicosHoje: 0, totalGeralHoje: 0 });
  const [formData, setFormData] = useState({
    nome: "", categoria: "Racao", quantidade: "", valor: "", data: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    try {
      const [vendasRes, resumoRes] = await Promise.all([
        fetch(`${API_BASE}/vendas`),
        fetch(`${API_BASE}/vendas/financeiro`)
      ]);
      
      setVendas(await vendasRes.json());
      setResumo(await resumoRes.json());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/vendas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ ...formData, nome: "", quantidade: "", valor: "" });
        fetchData();
      }
    } catch (err) { alert("Erro ao vender"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apagar venda?")) {
      await fetch(`${API_BASE}/vendas/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Caixa e Vendas</h1>
      </div>

      <div className={styles.financePanel}>
        <div className={styles.financeCard}>
          <span className={styles.financeLabel}><ShoppingBag size={16} style={{marginBottom:-2, marginRight:5}}/> Produtos (Hoje)</span>
          <span className={styles.financeValue}>{formatMoney(resumo.vendasHoje)}</span>
        </div>
        <div className={styles.financeCard}>
          <span className={styles.financeLabel}><Activity size={16} style={{marginBottom:-2, marginRight:5}}/> Serviços (Hoje)</span>
          <span className={styles.financeValue}>{formatMoney(resumo.servicosHoje)}</span>
        </div>
        <div className={`${styles.financeCard} ${styles.highlight}`}>
          <span className={styles.financeLabel}><DollarSign size={16} style={{marginBottom:-2, marginRight:5}}/> Total Geral (Hoje)</span>
          <span className={styles.financeValue}>{formatMoney(resumo.totalGeralHoje)}</span>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>Registrar Venda</h3>
          <form onSubmit={handleCreate}>
            <div className={styles.formGroup}>
              <label>Produto / Descrição</label>
              <input required className={styles.input} value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} placeholder="Ex: Ração Golden 1kg" />
            </div>
            <div className={styles.formGroup}>
              <label>Categoria</label>
              <select className={styles.input} value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Quantidade / Peso</label>
              <input className={styles.input} value={formData.quantidade} onChange={e => setFormData({...formData, quantidade: e.target.value})} placeholder="Ex: 500g ou 1 un" />
            </div>
            <div className={styles.formGroup}>
              <label>Valor Total (R$)</label>
              <input required type="number" step="0.01" className={styles.input} value={formData.valor} onChange={e => setFormData({...formData, valor: e.target.value})} placeholder="0,00" />
            </div>
            <div className={styles.formGroup}>
              <label>Data</label>
              <DatePickerInput 
                selected={formData.data} 
                onChange={(date) => setFormData({ ...formData, data: date })} 
                placeholder="Selecione"
                required
              />
            </div>
            <button type="submit" className={styles.submitButton}>Confirmar Venda</button>
          </form>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Qtd.</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Data</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {vendas.map(v => (
                <tr key={v.id}>
                  <td>{v.nome}</td>
                  <td>{v.quantidade || "-"}</td>
                  <td>
                    <span className={`${styles.categoryTag} ${styles['cat'+v.categoria]}`}>
                      {v.categoria}
                    </span>
                  </td>
                  <td style={{fontWeight:'bold'}}>{formatMoney(v.valor)}</td>
                  <td>{new Date(v.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                  <td>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(v.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}