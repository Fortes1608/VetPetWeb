import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png"; 
import styles from "./Navbar.module.css"; 
export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: "Início", path: "/" },
    { name: "Clientes", path: "/clientes" },
    { name: "Pets", path: "/pets" },
    { name: "Agendamentos", path: "/agendamentos" },
    { name: "Vacinas", path: "/vacinas" },
    { name: "Vendas", path: "/vendas" },
  ];

  return (
    
    <nav className={styles.navbar}> 
      <div className={styles.content}>
        <Link to="/" className={styles.logoLink}>
          <img 
            src={logo} 
            alt="Logo VetPet" 
            className={styles.logoImage}
          />
          <span className={styles.logoText}>
            VetPet<span>Bichos</span>
          </span>
        </Link>

        <div className={styles.navLinks}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const linkClass = isActive 
              ? `${styles.navLink} ${styles.navLinkActive}` 
              : styles.navLink;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={linkClass} 
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}