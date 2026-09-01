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
    /*
    #swagger.tags = ['Estudiantes']
    #swagger.summary = 'Obtener todos los estudiantes o filtrarlos'
    #swagger.description = 'Endpoint para obtener todos los estudiantes o filtrarlos por nombre, email o bootcamp'
    #swagger.parameters['nombre'] = {
        in: 'query',
        description: 'Nombre del estudiante',
        type: 'string',
    }
    #swagger.parameters['email'] = {
        in: 'query',
        description: 'Email del estudiante',
        type: 'string',
    }
    #swagger.parameters['bootcamp'] = {
        in: 'query',
        description: 'Bootcamp del estudiante',
        type: 'string',
    }
    */
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
    /*
    #swagger.tags = ['Estudiantes']
    #swagger.summary = 'Obtener un estudiante por su ID'
    #swagger.description = 'Endpoint para obtener un estudiante específico utilizando su ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del estudiante',
        required: true,
        type: 'number',
    }
    #swagger.responses[200] = {
        description: 'Estudiante encontrado exitosamente',
        schema: {
            id: 1,
            nombre: 'Juan Perez',
            email: 'juan.perez@example.com',
            bootcamp: 'Bootcamp de Desarrollo Web'
        }
    }
    #swagger.responses[400] = {
        description: 'El ID proporcionado no es un número válido',
        schema: {
            error: 'El id debe de ser un valor'
        }
    }
    */
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
    /*
    #swagger.tags = ['Estudiantes']
    #swagger.summary = 'Crear un nuevo estudiante'
    #swagger.description = 'Endpoint para crear un nuevo estudiante'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del nuevo estudiante',
        required: true,
        schema: {
        nombre: 'Juan Perez',
        email: 'juan.perez@example.com',
        bootcamp: 'Bootcamp de Desarrollo Web'
        }
    }
    #swagger.responses[200] = {
        description: 'Estudiante creado exitosamente',
        schema: {
            id: 1,
            nombre: 'Juan Perez',
            email: 'juan.perez@example.com',
            bootcamp: 'Bootcamp de Desarrollo Web'
        }
    }
    #swagger.responses[400] = {
        description: 'Faltan campos obligatorios en la solicitud',
        schema: {
            error: 'Hay algun campo incompleto'
        }
    }
    */
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
    /*
    #swagger.tags = ['Estudiantes']
    #swagger.summary = 'Actualizar un estudiante existente'
    #swagger.description = 'Endpoint para actualizar un estudiante existente'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del estudiante a actualizar',
        required: true,
        type: 'number'
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos actualizados del estudiante',
        required: true,
        schema: {
            nombre: 'Juan Perez',
            email: 'juan.perez@example.com',
            bootcamp: 'Bootcamp de Desarrollo Web'
        }
    }
    #swagger.responses[200] = {
        description: 'Estudiante actualizado exitosamente',
        schema: {
            id: 1,
            nombre: 'Juan Perez',
            email: 'juan.perez@example.com',
            bootcamp: 'Bootcamp de Desarrollo Web'
        }
    }
    #swagger.responses[404] = {
        description: 'Estudiante no encontrado',
        schema: {
            error: 'Estudiante no encontrado'
        }
    }
    */
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
    /*
    #swagger.tags = ['Estudiantes']
    #swagger.summary = 'Eliminar un estudiante existente'
    #swagger.description = 'Endpoint para eliminar un estudiante existente'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del estudiante a eliminar',
        required: true,
        type: 'number'
    }
    #swagger.responses[200] = {
        description: 'Estudiante eliminado exitosamente',
        schema: {
            id: 1,
            nombre: 'Juan Perez',
            email: 'juan.perez@example.com',
            bootcamp: 'Bootcamp de Desarrollo Web'
        }
    }
    #swagger.responses[404] = {
        description: 'Estudiante no encontrado',
        schema: {
            error: 'Estudiante no encontrado'
        }
    }
    */
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