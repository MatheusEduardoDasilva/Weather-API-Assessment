## Weather API Assessment

API RESTful para **consulta de dados climáticos** de cidades, desenvolvida com **Node.js** e **TypeScript**. O projeto armazena o histórico das requisições em **PostgreSQL**, utilizando **Prisma ORM** e **Docker** para orquestração.

## Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **Docker e Docker Compose**
- **Swagger UI** (Documentação Interativa)

## Estrutura do Projeto

Abaixo está a estrutura principal de pastas e arquivos do projeto:

```bash
.
├── prisma/
│   ├── migrations/        # Histórico de migrações do banco de dados
│   └── schema.prisma      # Definição do modelo de dados (Prisma Schema)
├── src/
│   ├── index.ts           # Ponto de entrada e lógica principal da API
│   └── swagger.ts         # Configuração da documentação Swagger
├── .env                   # Variáveis de ambiente
├── docker-compose.yml     # Configuração dos serviços (API, DB, Adminer)
├── Dockerfile             # Instruções para construir a imagem Docker da API
```

## Como Executar o Projeto

### Pré-requisitos

- **Docker**
- **Docker Compose**

### Passos

1.  **Clonar repositório:**
    ```bash
    git clone [https://github.com/MatheusEduardoDasilva/Weather-API-Assessment.git](https://github.com/MatheusEduardoDasilva/Weather-API-Assessment.git)
    cd Weather-API-Assessment
    ```
2.  **Subir os containers (API, Banco e Adminer):**
    ```bash
    docker compose up -d
    ```

## Acessando os Serviços

Os seguintes serviços estarão disponíveis após a inicialização dos containers:

| Serviço                    | URL                          | Exemplo de Uso                                     |
| :------------------------- | :--------------------------- | :------------------------------------------------- |
| **API Principal**          | `http://localhost:3000`      | `http://localhost:3000/weather?city=Florianopolis` |
| **Documentação (Swagger)** | `http://localhost:3000/docs` | N/A                                                |
| **Adminer (UI do Banco)**  | `http://localhost:8080`      | N/A                                                |

## Endpoints Principais

| Método  | Rota                             | Descrição                                                                               |
| :------ | :------------------------------- | :-------------------------------------------------------------------------------------- |
| **GET** | `/weather?city={nome da cidade}` | Consulta dados climáticos de uma cidade (integra com API pública) e salva no histórico. |
| **GET** | `/weather/history`               | Retorna o histórico de consultas salvas no banco de dados.                              |
| **GET** | `/docs`                          | Documentação Swagger interativa (OpenAPI).                                              |

## Credenciais de Acesso

As credenciais a seguir são utilizadas nos arquivos de configuração do Docker Compose:

### PostgreSQL (Docker Service)

| Parâmetro                  | Valor            |
| :------------------------- | :--------------- |
| **Host** (Nome do Serviço) | `api-project-db` |
| **Porta** (Container)      | `5432`           |
| **Banco**                  | `weatherdb`      |
| **Usuário**                | `postgres`       |
| **Senha**                  | `123456`         |

### Adminer (Acesso via Browser em `http://localhost:8080`)

| Parâmetro         | Valor            |
| :---------------- | :--------------- |
| **Sistema**       | `PostgreSQL`     |
| **Servidor**      | `api-project-db` |
| **Usuário**       | `postgres`       |
| **Senha**         | `123456`         |
| **Base de Dados** | `weatherdb`      |

## Banco de Dados e Prisma ORM

### Observação de Conexão

**Importante:** Se você preferir rodar o **Prisma/CLI localmente** (fora do Docker), a URL de conexão deve usar `localhost:5432` (Ex: `postgresql://postgres:123456@localhost:5432/weatherdb?schema=public`).
Porém, ao rodar a API dentro do Docker Compose, a URL deve apontar para o host do serviço (`api-project-db`).

### Modelo Principal (`schema.prisma`)

```prisma
model Weather {
  id          Int      @id @default(autoincrement())
  cidade      String
  temperatura Float
  descricao   String
  umidade     Int
  criadoEm    DateTime @default(now())
}
```

Migrações
O projeto já contém o histórico de migrações em prisma/migrations. Ao subir via Docker Compose pela primeira vez, as migrações são aplicadas automaticamente (ou você pode executar manualmente):

docker compose exec api npx prisma migrate deploy

# Se precisar gerar novas migrations, use:

# docker compose exec api npx prisma migrate dev --name nome_da_migration

Manutenção e Configuração
Reprodução em Outro Host
Para reproduzir o ambiente, basta ter Docker/Docker Compose instalados e executar:

```Bash

docker compose up -d
Alteração de Senha/Variáveis
Se quiser mudar a senha do seu banco, edite o docker-compose.yml (ou configure um arquivo .env) e recrie os containers:
```

```Bash

docker compose down -v
docker compose up -d --build
```

Autor
Matheus Eduardo da Silva

```
Repositório: https://github.com/MatheusEduardoDasilva/Weather-API-Assessment
```
