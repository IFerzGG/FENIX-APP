import {Router} from "express";
import type {Request, Response} from "express";
import type { 
    Estudiante, 
    crearEstudiante, 
    actualizarEstudiante, 
    estudianteFiltrado 
} from "../types/estudiante.js";

const router = Router();

let estudiantes:Estudiante[] = [];

router.get("/status", (req:Request, res:Response) => {
    res.json({
        status:"Servidor en Linea",
        version:"1.0.0",
    });
});

router.get("/", (req:Request<{},{},{},estudianteFiltrado>, res:Response) => {
    const {nombre, email, bootcamp} = req.query;
    let resultadoFiltro = [...estudiantes];
    if(nombre){
        resultadoFiltro = resultadoFiltro.filter((e) => e.nombre.toLowerCase() === nombre.toLowerCase());
    }
    if(email){
        resultadoFiltro = resultadoFiltro.filter((e) => e.email.toLowerCase() === email.toLowerCase());
    }
    if(bootcamp){
        resultadoFiltro = resultadoFiltro.filter((e) => e.bootcamp.toLowerCase() === bootcamp.toLowerCase());
    }

    return res.json({Total: resultadoFiltro.length, Dato: resultadoFiltro,});
});

/*router.get("/", (req:Request,res:Response) => {
    res.json(estudiantes);
});*/

router.get("/:id", (req:Request, res:Response) => {
    const id = Number(req.params.id);
    if(isNaN(id)){
        return res.status(400).json({error:"El id debe de ser un valor"});
    }
    const estudianteEncontrado = estudiantes.find((e) => e.id === id);
    if(!estudianteEncontrado){
       return res.status(404).json({mensake: "Usuario no Encontrado"});
    }
    res.status(200).json(estudianteEncontrado);
});

router.post("/", (req:Request<{},{},crearEstudiante>, res:Response) => {
    const {nombre, email, bootcamp} = req.body;
    if(!nombre || !email || !bootcamp) {
        return res.status(400).json({error: "Hay algun campo incompleto"});
    }
    const nuevoEstudiante:Estudiante = {
        id: estudiantes.length + 1,
        nombre,
        email,
        bootcamp,
    }
    estudiantes.push(nuevoEstudiante);
    res.status(200).json(nuevoEstudiante);
});

router.put("/:id", (req:Request<{id:string},{},actualizarEstudiante>, res:Response) => {
    const id = Number(req.params.id);
    const index = estudiantes.findIndex((e) => e.id == id)
    if(index === -1) {
        return res.status(404).json({error: "Estudiante no encontrado"});
    }
    const {nombre, email, bootcamp}:actualizarEstudiante = req.body;
    estudiantes[index] = {
        id:id,
        nombre: nombre ?? estudiantes[index]?.nombre,
        email: email ?? estudiantes[index]?.email,
        bootcamp: bootcamp ?? estudiantes[index]?.bootcamp
    }
    res.status(200).json(estudiantes[index]);
});

router.delete("/:id", (req:Request,res:Response) =>{
    const id = Number(req.params.id);
    const index = estudiantes.findIndex((e) => e.id == id)
    if(index === -1) {
        return res.status(404).json({error: "Estudiante no encontrado por ende no se puede eliminar"});
    }
    const eliminado = estudiantes[index];
    estudiantes = estudiantes.filter((e) => e.id !==id );
    res.status(200).json(eliminado);
});

export default router;