export const swaggerDocument = {
    openapi: "3.0.0",
    info: {
    title: "Weather API",
    version: "1.0.0",
    description: "API para consultar clima e historico de consultas.",
    },
    servers: [
    {
        url: "http://localhost:3000",
        description: "Servidor local",
    },
    ],
    tags: [
        {
            name: "Consultas de Clima",
        },
    ],

    
    paths: {
        
        "/weather": {
        get: {
            tags: ["Consultas de Clima"],
        summary: "Consulta o clima de uma cidade",
        parameters: [
            {
            name: "city",
            in: "query",
            required: false,
            description: "Nome da cidade (ex: Florianopolis, BR)",
            schema: { type: "string" },
            },
        ],
        responses: {
            200: {
            description: "Clima atual da cidade",
            },
            500: {
            description: "Erro ao buscar dados da API",
            },
        },
        },
    },
    "/weather/history": {
        get: {
            tags: ["historico de consultas"], 
            summary: "historico de consultas meteorologicas",
        responses: {
            200: {
            description: "Lista de consultas armazenadas",
            },
            500: {
            description: "Erro ao buscar dados do banco",
            },
        },
        },
    },
    },
};
