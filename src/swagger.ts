import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "API de Inscripciones Academica",
        description: "Documentacion de la API REST del MP-S2",
        version: "1.0.0",
    },
    hosts: "localhost:3000",
};

const outputFile = "./swagger-output.json";
const routes = ["./src/index.ts"];

swaggerAutogen()(outputFile, routes, doc);