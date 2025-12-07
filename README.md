# 🐾 VetPet - Sistema de Gestão Veterinária

O **VetPet** é uma aplicação web completa desenvolvida para facilitar a administração de clínicas veterinárias. O sistema permite o controle de clientes, pacientes (pets), agendamentos, histórico médico, vacinas e controle financeiro diário.

## 🚀 Funcionalidades

### 📊 Dashboard (Visão Geral)
- Resumo financeiro do dia (Vendas + Serviços).
- Lista de próximos agendamentos do dia.
- Alertas automáticos de vacinas vencendo ou atrasadas.

### 👥 Gestão de Clientes e Pets
- Cadastro completo de tutores.
- Prontuário eletrônico do Pet (Histórico de consultas e vacinas).
- Associação automática de Pets aos seus donos.

### 📅 Agenda Inteligente
- Visualização em **Lista** ou **Calendário Semanal**.
- Bloqueio automático de horários (sábados à tarde e domingos).
- Cálculo automático de horários disponíveis (slots de 30 min).
- Status de agendamento (Pendente, Concluído, Cancelado).

### 💉 Controle de Vacinas
- Registro de aplicações e data de reforço.
- Sistema de "Semáforo" para status:
  - 🟢 **Em dia**
  - 🟡 **Vence em breve** (30 dias)
  - 🔴 **Atrasada**

### 💰 Controle de Caixa (Vendas)
- Registro de venda de produtos (Ração, Medicamentos, Acessórios).
- Soma automática do faturamento diário e semanal.
- Integração do valor dos serviços (agendamentos) no caixa total.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React.js** (Vite)
- **CSS Modules** (Estilização modular e responsiva)
- **Lucide React** (Ícones modernos)
- **Date-fns** (Manipulação avançada de datas)
- **React Datepicker** (Seleção de datas intuitiva)

### Backend
- **Node.js** & **Express**
- **SQLite** (Banco de dados leve e portátil)
- **Sequelize ORM** (Gerenciamento do banco de dados)

---

## 📦 Como Rodar o Projeto

Pré-requisitos: Você precisa ter o **Node.js** instalado na sua máquina.

### 1. Configurar o Backend (Servidor)

Abra um terminal na pasta raiz do projeto:

```bash
cd backend
npm install   # Instala as dependências
npm start     # Inicia o servidor (Porta 3000)
O banco de dados database.db será criado automaticamente na primeira execução.

2. Configurar o Frontend (Interface)
Abra um segundo terminal na pasta raiz:

Bash

cd frontend/vetpet-frontend
npm install   # Instala as dependências
npm run dev   # Inicia o React
Acesse o sistema no navegador através do link mostrado (geralmente http://localhost:5173).

📂 Estrutura do Projeto
Vetpet-web/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Lógica das regras de negócio
│   │   ├── models/        # Definição das tabelas do Banco
│   │   ├── routes/        # Rotas da API (Endpoints)
│   │   └── database/      # Arquivo SQLite
│   └── index.js           # Entrada do servidor
│
└── frontend/vetpet-frontend/
    ├── src/
    │   ├── components/    # Componentes reutilizáveis (Navbar, DatePicker)
    │   ├── pages/         # Telas (Dashboard, Clientes, Pets, Agenda, etc.)
    │   └── assets/        # Imagens e Logotipos
    └── App.jsx            # Configuração de Rotas
📝 Autor
Desenvolvido por Lorenzo Fortes Neto. Projeto acadêmico/profissional para gestão clínica.