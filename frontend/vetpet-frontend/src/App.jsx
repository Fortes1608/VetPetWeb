import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard'; // Importe o Dashboard
import Clientes from './pages/Clientes';
import ClienteDetalhe from './pages/ClienteDetalhe';
import Pets from './pages/Pets';
import PetDetalhe from './pages/PetDetalhe';
import Agendamentos from './pages/Agendamentos';
import Vacinas from './pages/Vacinas';
import Vendas from './pages/Vendas';

export default function App() {
  return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/:id" element={<ClienteDetalhe />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/pets/:id" element={<PetDetalhe />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/vacinas" element={<Vacinas />} />
          <Route path="/vendas" element={<Vendas />} />
        </Routes>
      </BrowserRouter>
  )
}