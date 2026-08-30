import fs from "node:fs/promises"; //Crear archivo 
import path from "node:path"; //Crear ruta
import Express  from "express"; // Importando express desde el paquete
import type { NextFunction, Request, Response } from "express";; // Importando los dos tipos
import indexRouter from "./routes/estudiante.js"

const app = Express();
const PORT = 3000;
app.use(Express.json());

app.use("/api/estudiantes", indexRouter);

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});