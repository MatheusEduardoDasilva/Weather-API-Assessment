import http from "http";
import axios from "axios";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { swaggerDocument } from "./swagger.js";



dotenv.config();

const prisma = new PrismaClient();
const PORT = 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
    console.error("ERRO: Variável OPENWEATHER_API_KEY não definida no .env");
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
        const city = reqUrl.searchParams.get("city") || "Biguaçu, BR";

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
            if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
                res.statusCode = 404;
                res.end(JSON.stringify({ erro: `A cidade não foi encontrada.` }));
            } 
            else {
                console.error("Erro ao buscar dados da API ou salvar no Banco de Dadoos:", error);
                res.statusCode = 500;
                res.end(JSON.stringify({ erro: "Erro interno ao buscar ou salvar os dados." }));
            }
        }

        return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ erro: "Rota não encontrada." }));

});




server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Exemplo: http://localhost:${PORT}/weather?city=Biguacu`);
    console.log(`Histórico: http://localhost:${PORT}/weather/history`);
    console.log(`Swagger Docs: http://localhost:${PORT}/docs`);
});
