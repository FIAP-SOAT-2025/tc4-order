# 🍔 TC4-Order - Sistema de Gerenciamento de Pedidos

Sistema de gerenciamento de pedidos desenvolvido com **Clean Architecture** para o Tech Challenge 4 da FIAP - Pós-graduação em Arquitetura de Software.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Como Rodar com Docker](#como-rodar-com-docker)
- [Testes](#testes)
- [Deploy na AWS](#deploy-na-aws)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Endpoints da API](#endpoints-da-api)

---

## 🎯 Sobre o Projeto

O **tc4-order** é um microserviço responsável pelo gerenciamento de pedidos do sistema FIAP Fast Food. Ele faz parte de uma arquitetura de microserviços e se integra com outros serviços externos via API REST, ele atua como **orquestrador**, consultando os serviços externos e agregando as respostas para completar a criação do pedido.

- **Customer Service**: Serviço externo consultado para verificar se um cliente existe a partir do CPF. Retorna os dados do cliente.

- **Item Service**: Serviço externo consultado para validar se os itens do pedido existem e estão disponíveis. Retorna informações dos produtos.

- **Payment Service**: Serviço externo responsável por criar e processar pagamentos. Recebe os dados do pedido e retorna o status da transação.

### Infraestrutura

- **Banco de Dados Dedicado**: O microserviço possui seu próprio banco de dados PostgreSQL (RDS na AWS), seguindo o padrão de **Database per Service** da arquitetura de microserviços. Isso garante isolamento de dados e independência operacional.

- **Kubernetes**: A aplicação é orquestrada no **AWS EKS** (Elastic Kubernetes Service), permitindo escalabilidade automática, alta disponibilidade e gerenciamento simplificado de containers.

- **Terraform**: Toda a infraestrutura é provisionada como código (**Infrastructure as Code**), incluindo:
  - Cluster EKS e nodes
  - RDS PostgreSQL
  - Networking (VPC, Subnets, Security Groups)
  - ConfigMaps e Secrets
  - Deployments e Services Kubernetes

### Principais Funcionalidades

- ✅ Criar pedidos com validação de cliente e itens
- ✅ Listar todos os pedidos ordenados por status e data
- ✅ Buscar pedido por ID
- ✅ Atualizar status do pedido (RECEIVED → PREPARING → READY → COMPLETED)
- ✅ Integração com serviços externos via HTTP
- ✅ Persistência com PostgreSQL usando Prisma ORM
- ✅ Validação de CPF, se é um número valido
- ✅ Cálculo automático de valores dos pedidos

---

## 🏗️ Arquitetura

O projeto segue os princípios da Clean Architecture, garantindo separação clara de responsabilidades e independência de frameworks externos.

- ✅ Independência de frameworks
- ✅ Testabilidade
- ✅ Independência de banco de dados
- ✅ Independência de agentes externos

### Camadas da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     Infrastructure Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  REST API    │  │  Prisma      │  │  External APIs   │  │
│  │  (NestJS)    │  │  Repository  │  │  (Customer, Item,│  │
│  │              │  │              │  │   Payment)       │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Application Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Gateways   │  │  Use Cases   │  │   Controllers    │  │
│  │  (Adapters)  │  │  (Business)  │  │  (Orchestrator)  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      Domain Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Entities   │  │    Enums     │  │   Interfaces     │  │
│  │   (Models)   │  │   (States)   │  │    (Ports)       │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```



---

## 🛠️ Tecnologias

- **Node.js** 22
- **NestJS** 11 - Framework backend
- **TypeScript** - Linguagem
- **Prisma** 6 - ORM
- **PostgreSQL** 15 - Banco de dados
- **Jest** - Testes unitários
- **Docker** - Containerização
- **Kubernetes** - Orquestração
- **AWS EKS** - Deploy em produção
- **Terraform** - Infrastructure as Code
- **GitHub Actions** - CI/CD

---

## 📁 Estrutura de Pastas

```
tc4-order/
├── src/
│   ├── order/                          # Módulo principal de pedidos
│   │   ├── entities/                   # Entidades de domínio
│   │   │   ├── order.entity.ts         # Entidade Order
│   │   │   ├── orderItem.entity.ts     # Entidade OrderItem
│   │   │   └── customerCpf/            # Value Object CPF
│   │   │       └── cpf.entity.ts
│   │   │
│   │   ├── enums/                      # Enumerações
│   │   │   └── orderStatus.enum.ts     # Status do pedido
│   │   │
│   │   ├── usecases/                   # Casos de uso (regras de negócio)
│   │   │   ├── order/
│   │   │   │   ├── createOrder/        # Criar pedido
│   │   │   │   ├── findOrder/          # Buscar pedidos
│   │   │   │   ├── updateOrder/        # Atualizar status
│   │   │   │   ├── processOrder/       # Processar pedido
│   │   │   │   └── validated/          # Validações
│   │   │   ├── customer/               # Buscar cliente
│   │   │   ├── item/                   # Validar itens
│   │   │   └── payment/                # Criar pagamento
│   │   │
│   │   ├── gateways/                   # Gateways (Ports)
│   │   │   ├── order.gateway.ts
│   │   │   ├── customer.gateway.ts
│   │   │   ├── item.gateway.ts
│   │   │   └── payment.gateway.ts
│   │   │
│   │   ├── infraestructure/            # Infraestrutura (Adapters)
│   │   │   ├── api/                    # Controllers e DTOs
│   │   │   │   ├── controllers/
│   │   │   │   │   └── order.api.ts    # API REST
│   │   │   │   └── dto/                # Data Transfer Objects
│   │   │   │
│   │   │   ├── persistence/            # Repositórios
│   │   │   │   ├── order.repository.ts # Implementação Prisma
│   │   │   │   └── mappers/            # Mappers DB ↔ Domain
│   │   │   │
│   │   │   └── external/               # Clientes externos
│   │   │       ├── customer/           # Cliente Customer API
│   │   │       ├── item/               # Cliente Item API
│   │   │       └── payment/            # Cliente Payment API
│   │   │
│   │   ├── presenters/                 # Formatação de resposta
│   │   │   ├── orderMap.ts             # Mapper principal
│   │   │   ├── orderToJson.presenter.ts
│   │   │   └── mappers/                # Mappers específicos
│   │   │
│   │   ├── interfaces/                 # Contratos (Interfaces)
│   │   │   ├── order.interface.ts
│   │   │   ├── clients-interfaces/     # Interfaces de clientes
│   │   │   ├── gateways-interfaces/    # Interfaces de gateways
│   │   │   └── responses-interfaces/   # Interfaces de resposta
│   │   │
│   │   └── controllers/                # Controllers do módulo
│   │       └── order.controller.ts
│   │
│   ├── health/                         # Health check
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   │
│   ├── shared/                         # Código compartilhado
│   │   ├── infra/
│   │   │   └── prisma.service.ts       # Serviço Prisma
│   │   └── exceptions/                 # Exception handling
│   │       ├── exceptions.base.ts
│   │       └── exception.mapper.ts
│   │
│   ├── repository/                     # Ports de repositório
│   │   └── db.port.ts
│   │
│   ├── app.module.ts                   # Módulo principal
│   └── main.ts                         # Bootstrap da aplicação
│
├── prisma/                             # Prisma ORM
│   ├── schema.prisma                   # Schema do banco
│   ├── seed.ts                         # Seed de dados
│   └── migrations/                     # Migrações
│
├── terraform/                          # Infrastructure as Code
│   ├── k8s-deployment.tf               # Deployment Kubernetes
│   ├── k8s-service.tf                  # Service
│   ├── k8s-configmap.tf                # ConfigMap
│   ├── k8s-secrets.tf                  # Secrets
│   └── ...
│
├── .github/
│   └── workflows/                      # CI/CD
│       ├── build-and-push.yml          # Build Docker
│       └── terraform-deploy.yml        # Deploy completo
│
├── Dockerfile                          # Imagem Docker
├── docker-compose.yml                  # Ambiente local
├── jest.config.js                      # Configuração de testes
└── README.md                           # Este arquivo
```

---


## 🧪 Testes

### Rodar todos os testes

```bash
npm test
```

### Rodar testes com coverage

```bash
npm run test:cov
```

### Rodar testes em modo watch

```bash
npm run test:watch
```


### Coverage atual

O projeto mantém **>80% de cobertura de testes** com foco em:
- ✅ Entities (lógica de domínio)
- ✅ Use Cases (regras de negócio)
- ✅ Gateways (integrações)
- ✅ Repositories (persistência)
- ✅ Controllers (API)
- ✅ External Clients (APIs externas)
- ✅ **BDD (Behavior-Driven Development)**: Implementado em `findOrder.usecase.spec.ts` usando sintaxe Given/When/Then

### Quality Gate - SonarCloud

O projeto utiliza **SonarCloud** para análise de qualidade de código e possui uma **Quality Gate** configurada que:

- 🚨 **Bloqueia o merge** se a cobertura de testes for **inferior a 70%**
- ✅ **Coverage atual**: **>80%** (acima do threshold mínimo)
- 📊 A validação é executada automaticamente em cada Pull Request
- 🔒 Apenas código que passa pelo Quality Gate pode ser mergeado na branch `main`

### Amostra de bloqueio quando o  coverage  é menor que 80% para novas features.

![Coverage abaixo de 80%](./assets/order-test-66.png)

### Amostra do coverage de teste maior que 80%
![Coverage maior que 80%](./assets/order-test-80.png)


**Ver relatório completo:**
- [SonarCloud Dashboard](https://sonarcloud.io/project/overview?id=FIAP-SOAT-2025_tc4-order)
- Análise de code smells, bugs e vulnerabilidades
- Métricas de maintainability e reliability

---


## 📦 Pré-requisitos

- **Node.js** 22.x ou superior
- **npm** ou **yarn**
- **Docker** e **Docker Compose**
- **PostgreSQL** 15 (ou use Docker)

---

## 🚀 Como Rodar Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/FIAP-SOAT-2025/tc4-order.git
cd tc4-order
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://admin:password@localhost:5432/lanchonete_db?schema=public"
DB_USER="admin"
DB_PASSWORD="password"
DB_NAME="lanchonete_db"

# External Services
ITEM_SERVICE_URL="http://localhost:3001"
CUSTOMER_SERVICE_URL="http://localhost:3002"
PAYMENT_SERVICE_URL="http://localhost:3003"

# Application
PORT=3000
NODE_ENV=development
```

### 4. Suba o banco de dados PostgreSQL

```bash
docker run -d \
  --name postgres-tc4 \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=lanchonete_db \
  -p 5432:5432 \
  postgres:15
```

### 5. Execute as migrações

```bash
npx prisma migrate deploy
```

### 6. Inicie a aplicação

```bash
# Modo desenvolvimento (com hot reload)
npm run start
```

A aplicação estará disponível em: **http://localhost:3000**

---

## 🐳 Como Rodar com Docker

### Opção 1: Docker Compose (Recomendado para desenvolvimento)

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

Isso irá subir:
- ✅ PostgreSQL (porta 5432)
- ✅ Aplicação tc4-order (porta 3000)

---


## ☁️ Deploy na AWS

### Pré-requisitos

- AWS Account (pode usar AWS Academy)
- Terraform instalado
- kubectl instalado
- AWS CLI configurado

### Estrutura de Deploy

```
1. S3 Bucket (terraform-state)
2. VPC + EKS Cluster (terraform-infra)
3. RDS PostgreSQL (terraform-db)
4. Application Deploy (tc4-order/terraform)
5. API Gateway Integration (terraform-api-gateway-integration)
```

### Deploy via GitHub Actions

1. **Configure Secrets no GitHub:**

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_SESSION_TOKEN
DOCKER_USERNAME
DOCKER_PASSWORD
DB_USER
DB_PASSWORD
DB_NAME
ACCESS_TOKEN
ITEM_SERVICE_URL
CUSTOMER_SERVICE_URL
PAYMENT_SERVICE_URL
```

2. **Faça push para main:**

```bash
git push origin main
```

3. **Execute o workflow manualmente:**

- Vá em **Actions** → **"Deploy Completo - tc4-order"**
- Click **"Run workflow"**
- Selecione **"deploy"**

### Deploy Manual

```bash
# 1. S3 para remote state
cd terraform-infra/s3
terraform init && terraform apply

# 2. Infraestrutura (EKS)
cd ../
terraform init && terraform apply

# 3. Banco de dados (RDS)
cd ../../terraform-db
terraform init && terraform apply

# 4. Aplicação
cd ../tc4-order/terraform
terraform init && terraform apply

# 5. Verificar
kubectl get pods -n tc4-order
kubectl logs -f -l app=tc4-order-api -n tc4-order
```

---

## 🔐 Variáveis de Ambiente

### Aplicação

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão do PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `DB_USER` | Usuário do banco | `admin` |
| `DB_PASSWORD` | Senha do banco | `password` |
| `DB_NAME` | Nome do banco | `lanchonete_db` |
| `PORT` | Porta da aplicação | `3000` |
| `NODE_ENV` | Ambiente | `development` / `production` |

### Serviços Externos

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `ITEM_SERVICE_URL` | URL do serviço de itens | `http://item-api:3001` |
| `CUSTOMER_SERVICE_URL` | URL do serviço de clientes | `http://customer-api:3002` |
| `PAYMENT_SERVICE_URL` | URL do serviço de pagamentos | `http://payment-api:3003` |

---

## 📡 Endpoints da API

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok"
}
```

### Criar Pedido

```http
POST /order
Content-Type: application/json

{
  "customerId": "12345678900",
  "orderItems": [
    {
      "itemId": "uuid-item-1",
      "quantity": 2,
      "price": 25.50
    }
  ]
}
```

### Listar Pedidos

```http
GET /order
```

Retorna pedidos ordenados por:
1. Status (READY → PREPARING → RECEIVED)
2. Data de criação (mais antigos primeiro)

### Buscar Pedido por ID

```http
GET /order/:id
```

### Atualizar Status

```http
PATCH /order/:id/status
Content-Type: application/json

{
  "status": "PREPARING"
}
```

**Status permitidos:**
- `PENDING` → `RECEIVED` → `PREPARING` → `READY` → `COMPLETED`
- `CANCELLED` (qualquer momento)

---

## 📚 Documentação Adicional

- [Swagger API Docs](http://localhost:3000/api) (quando rodando localmente)
- [Prisma Schema](./prisma/schema.prisma)
- [GitHub Actions Workflows](./.github/workflows/)

---

## 👥 Autores

Desenvolvido como parte do **Tech Challenge 4** - FIAP Pós-graduação em Arquitetura de Software

| Nome | RM |
|------|-----|
| Daniela Rêgo Lima de Queiroz | RM361289 |
| Diana Bianca Santos Rodrigues | RM361570 |
| Felipe Alves Teixeira | RM362585 |
| Luiz Manoel Resplande Oliveira| RM363920 |
| Thaís Lima de Oliveira Nobre | RM362744 |

---

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais como parte do curso de pós-graduação da FIAP.


---


**Made with ❤️ for FIAP Tech Challenge 4**