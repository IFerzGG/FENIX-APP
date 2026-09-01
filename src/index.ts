import fs from "node:fs"; //Crear archivo 
import path from "node:path"; //Crear ruta
import Express  from "express"; // Importando express desde el paquete
import type { NextFunction, Request, Response } from "express";; // Importando los dos tipos
import indexRouter from "./routes/estudiante.js"
import swaggerUi from "swagger-ui-express";

const app = Express();
const PORT = 3000;
app.use(Express.json());

const swaggerFilePath = path.resolve("./src/swagger-output.json");
if(fs.existsSync(swaggerFilePath)) {
    const swaggerDocumento = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocumento));
}
else {
    console.log("archivo swagger-output.json no encontrado");
}

app.use("/api/estudiantes", indexRouter);

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});