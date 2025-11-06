import http from "http";
import axios from "axios";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";



dotenv.config();

const prisma = new PrismaClient();
const PORT: number = 3000;
const API_KEY: string | undefined = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
    console.error("ERRO: A variável OPENWEATHER_API_KEY não está definida.");
    process.exit(1);
}

const server = http.createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    const reqUrl = new URL(req.url || "", `http://${req.headers.host}`);
    const pathname = reqUrl.pathname;

    if (pathname === "/weather" && req.method === "GET") {
        const city = reqUrl.searchParams.get("city");
        if (!city) {
            res.statusCode = 400;
            res.end(JSON.stringify({ erro: "Parâmetro 'city' é obrigatório." }));
            return;
        }

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
            res.end(JSON.stringify(weatherInfo));

        } catch (error) {
            if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
                res.statusCode = 404;
                res.end(JSON.stringify({ erro: `A cidade '${city}' não foi encontrada.` }));
            } else {
                console.error(error);
                res.statusCode = 500;
                res.end(JSON.stringify({ erro: "Erro interno ao buscar ou salvar os dados." }));
            }
        }

    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ erro: "Rota não encontrada." }));
    }
});

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Exemplo: http://localhost:${PORT}/weather?city=Biguacu`);
});
