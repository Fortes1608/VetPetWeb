# 🐾 VetPet API — Documentação

API REST desenvolvida com **Node.js + Express + Sequelize + SQLite**  
Gerencia clientes, pets, serviços, agendamentos e vacinas.

---

## 🧱 Base URL

```
http://localhost:3000
```

---

## 👥 CLIENTES

### **GET /clientes**
Retorna todos os clientes.

**Exemplo de resposta**
```json
[
  { "id": 1, "nome": "João Silva", "telefone": "11999990000" },
  { "id": 2, "nome": "Maria Souza", "telefone": "11988887777" }
]
```

---

### **POST /clientes**
Cria um novo cliente.

**Body JSON**
```json
{
  "nome": "João Silva",
  "telefone": "11999990000"
}
```

**Possíveis erros**
```json
{ "error": "Nome e telefone são obrigatórios" }
```

---

### **GET /clientes/:id**
Retorna um cliente específico.

**Exemplo**
`GET /clientes/1`

**Resposta**
```json
{ "id": 1, "nome": "João Silva", "telefone": "11999990000" }
```

---

### **PUT /clientes/:id**
Atualiza dados de um cliente.

**Body**
```json
{
  "telefone": "11911112222"
}
```

---

### **DELETE /clientes/:id**
Remove um cliente e seus pets associados.

---

## 🐶 PETS

### **GET /pets**
Retorna todos os pets com seu cliente.

```json
[
  {
    "id": 1,
    "nome": "Rex",
    "especie": "Cachorro",
    "raca": "Labrador",
    "clienteId": 1,
    "Cliente": { "id": 1, "nome": "João Silva" }
  }
]
```

---

### **POST /pets**
Cria um novo pet.

```json
{
  "nome": "Rex",
  "especie": "Cachorro",
  "raca": "Labrador",
  "clienteId": 1
}
```

---

## 🧼 SERVIÇOS

### **GET /servicos**
Retorna todos os serviços.

```json
[
  { "id": 1, "nome": "Banho", "preco": 50 },
  { "id": 2, "nome": "Tosa", "preco": 70 }
]
```

---

### **POST /servicos**
Cria um novo serviço.

```json
{
  "nome": "Banho e Tosa",
  "preco": 90
}
```

---

## 📅 AGENDAMENTOS

### **GET /agendamentos**
Retorna todos os agendamentos, incluindo pet e serviço.

```json
[
  {
    "id": 1,
    "data": "2025-11-12",
    "hora": "14:00",
    "observacoes": "Cliente prefere horário da tarde",
    "Pet": { "id": 1, "nome": "Rex" },
    "Servico": { "id": 1, "nome": "Banho" }
  }
]
```

---

### **POST /agendamentos**
Cria um novo agendamento.

```json
{
  "data": "2025-11-12",
  "hora": "14:00",
  "observacoes": "Primeira visita",
  "petId": 1,
  "servicoId": 1
}
```

---

## 💉 VACINAS

### **GET /vacinas**
Lista todas as vacinas.

```json
[
  {
    "id": 1,
    "nome": "Antirrábica",
    "data_aplicacao": "2025-11-01",
    "data_reforco": "2026-11-01",
    "status": "pendente",
    "Pet": { "id": 1, "nome": "Rex" }
  }
]
```

---

### **POST /vacinas**
Cria uma nova vacina para um pet.

```json
{
  "nome": "V10",
  "data_aplicacao": "2025-11-10",
  "data_reforco": "2026-11-10",
  "status": "pendente",
  "pet_id": 1
}
```

---

## ⚠️ Códigos de Erro Comuns

| Código | Descrição |
|--------|------------|
| 400 | Requisição inválida (faltam campos) |
| 404 | Recurso não encontrado |
| 500 | Erro interno do servidor |

---

## 🧪 Teste Rápido via cURL

```bash
# Criar Cliente
curl -X POST http://localhost:3000/clientes -H "Content-Type: application/json" -d '{"nome":"João Silva","telefone":"11999990000"}'

# Criar Pet
curl -X POST http://localhost:3000/pets -H "Content-Type: application/json" -d '{"nome":"Rex","especie":"Cachorro","raca":"Labrador","clienteId":1}'
```

---

## 📖 Observações

- Todas as tabelas estão relacionadas via Sequelize.
- O banco SQLite é criado automaticamente.
- `timestamps: false` em todos os modelos (sem createdAt/updatedAt).
