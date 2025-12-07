import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { Users, PawPrint, Calendar } from "lucide-react"; // Ícones

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        
        <div className={styles.hero}>
          <h2 className={styles.heroTitle}>
            Bem-vindo à <span>VetPet</span>
          </h2>
          <p className={styles.heroSubtitle}>
            Gerencie clientes, pets e vacinas de forma simples e eficiente.
            Centralize o controle da sua clínica em um só lugar.
          </p>
        </div>

        <div className={styles.cardGrid}>
          
          <Link to="/clientes" className={styles.card}>
            <h3 className={styles.cardTitle}>
              
              <Users size={24} /> 
              Gerenciar Clientes
            </h3>
            <p className={styles.cardDescription}>
              Adicione, edite e visualize a lista completa de clientes e seus
              pets associados.
            </p>
          </Link>

          <Link to="/pets" className={styles.card}>
            <h3 className={styles.cardTitle}>
              
              <PawPrint size={24} />
              Gerenciar Pets
            </h3>
            <p className={styles.cardDescription}>
              Acesse o perfil de cada animal, histórico de vacinas e
              agendamentos passados.
            </p>
          </Link>

          <Link to="/agendamentos" className={styles.card}>
            <h3 className={styles.cardTitle}>
              
              <Calendar size={24} />
              Ver Agenda
            </h3>
            <p className={styles.cardDescription}>
              Visualize o calendário de consultas, banhos, tosas e outros
              serviços agendados.
            </p>
          </Link>

        </div>
      </main>

      <footer className={styles.footer}>
        © 2025 VetPet. Todos os direitos reservados.
      </footer>
    </div>
  );
}