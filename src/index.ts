import http from "http";
import axios from "axios";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { swaggerDocument } from "./swagger.js";



dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000; 
const EXTERNAL_PORT = 3001; 
const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
    console.error("ERRO: Variavel OPENWEATHER_API_KEY nao definida no .env");
    process.exit(1);
}

const server = http.createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    const reqUrl = new URL(req.url || "", `http://${req.headers.host}`);
    const pathname = reqUrl.pathname;

    if (pathname === "/docs") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        const html = `
            <!DOCTYPE html>

            <html>
                <head>
                    <title>Swagger UI</title>
                    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
                </head>
                <body>
                    <div id="swagger-ui"></div>

                    <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>

                    <script>
                        window.onload = () => {
                            window.ui = SwaggerUIBundle({
                                spec: ${JSON.stringify(swaggerDocument)},
                                dom_id: '#swagger-ui'
                            });
                        };
                    </script>
                </body>
            </html>
        `;
        res.end(html);
        return;
    }

    if (pathname === "/weather" && req.method === "GET") {
        const city = reqUrl.searchParams.get("city") || "Biguacu, BR";

        try {
            const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
                params: {
                    q: city,
                    appid: API_KEY,
                    units: "metric",
                    lang: "pt_br",
                },
            });

            const data = response.data;
            const weatherInfo = {
                cidade: data.name,
                temperatura: data.main.temp,
                descricao: data.weather[0].description,
                umidade: data.main.humidity,
            };

            await prisma.weather.create({
                data: {
                cidade: weatherInfo.cidade,
                temperatura: weatherInfo.temperatura,
                descricao: weatherInfo.descricao,
                umidade: weatherInfo.umidade,
                },
            });

            res.statusCode = 200;
            res.end(JSON.stringify(weatherInfo, null, 2));
        } 
        
        catch (error) {
            console.error("Erro ao buscar dados da API:", error);
            res.statusCode = 500;
            res.end(JSON.stringify({ erro: "Erro ao buscar dados da API." }));
        }
        return;
    }


    if (pathname === "/weather/history" && req.method === "GET") {
        try {
            const records = await prisma.weather.findMany({
                orderBy: { id: "desc" },
            });
                
            res.statusCode = 200;
            res.end(JSON.stringify(records, null, 2));
        } 

        catch (error) {
            console.error("Erro ao buscar dados do Banco de Dados:", error);
            res.statusCode = 500;
            res.end(JSON.stringify({ erro: "Erro interno ao buscar o historico de dados." }));
        }

        return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ erro: "Rota nao encontrada." }));

});


server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${EXTERNAL_PORT}`);
    console.log(`Exemplo: http://localhost:${EXTERNAL_PORT}/weather?city=Biguacu`);
    console.log(`Historico: http://localhost:${EXTERNAL_PORT}/weather/history`);
    console.log(`Swagger Docs: http://localhost:${EXTERNAL_PORT}/docs`);
});