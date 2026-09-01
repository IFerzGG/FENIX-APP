import {Router} from "express";
import type { NextFunction, Request, Response } from "express"; // Importando los dos tipos

import {
    listaEstudiantes,
    setListaEstudiantes,
    cargarDatos
} from "../data/estudiantes.data.js";

import type { Estudiante,
    crearEstudiante,
    actualizarEstudiante,
    estudiantesFiltrados,
    idBuscado,
    notasParams 
} from "../types/estudiantes.types.js";

const router = Router();

router.get("/", (req:Request, res:Response) => {
    /* 
    #swagger.tags = ['Estudiantes']
    #swagger.summary = 'Obtener todos los estudiantes'
    #swagger.description = 'Obtener todos los estudiantes'
    */
    res.json(listaEstudiantes);
});

//req.query edpoints para hacer peticion de estudiantes filtrados
router.get("/filtro", (req:Request<{},{},{},estudiantesFiltrados>,res:Response) => {
    /*
    #swagger.tags = ['Estudiantes']
    #swagger.summary = 'Obtener estudiantes filtrados'
    #swagger.description = 'Obtener estudiantes filtrados por nombre, país, edad mínima y estado'
    #swagger.parameters['nombre'] = {
        in: 'query',
        description: 'Nombre del estudiante',
        type: 'string'
    }
    #swagger.parameters['pais'] = {
        in: 'query',
        description: 'País del estudiante',
        type: 'string'
    }
    #swagger.parameters['minEdad'] = {
        in: 'query',
        description: 'Edad mínima del estudiante',
        type: 'integer'
    }
    #swagger.parameters['activo'] = {
        in: 'query',
        description: 'Estado del estudiante',
        type: 'string'
    }
    */
    const {nombre, pais, minEdad, activo} = req.query;
    let resultado = [...listaEstudiantes];
    //Filtros
    if(pais) {
        resultado = resultado.filter((e) => e.pais.toLowerCase() === pais.toLowerCase());
    }
    if(nombre) {
        resultado = resultado.filter((e) => e.nombre.toLowerCase() === nombre.toLowerCase());
    }
    if(minEdad) {
        const edadNumerica = Number(minEdad);
        if(!isNaN(edadNumerica)) {
            resultado = resultado.filter((e) => e.edad >= edadNumerica);
        }
        else {
            return res.json({error: "el edad minima debe de ser un numero"});
        }
    }
    if(activo) {
        if(activo.toLowerCase() === "true" || activo.toLowerCase() === "false") {
            const esActivo:boolean = activo.toLowerCase() === "true";
            resultado = resultado.filter((e) => e.activo === esActivo);
        }
        else{
            return res.json({error: "el estado activo debe ser true o false"});
        }
    }
    //mostrar resultado
    return res.json({
        total: resultado.length,
        datos: resultado,
    })
});

//edpoints para traer a todos los estudiantes por su id Creando ruta HTTP
router.get("/filtro/:id", (req:Request<idBuscado>, res:Response) => {
    /*
    #swagger.tags = ['Estudiantes']
    #swagger.summary = 'Obtener estudiante por ID'
    #swagger.description = 'Obtener estudiante por ID por su ID'
    #Swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del estudiante',
        required: true,
        type: 'number'
    }
    #swagger.responses[200] = {
        description: 'Estudiante encontrado',
        schema: {pais: 'Bolivia', nombre: 'Kevin', edad: 23, activo: true, notas: [80, 90, 75], id: 1}
    }
    #swagger.responses[400] = {
        description: 'Error en el parámetro de ruta',
        schema: {error: 'El parámetro id debe ser un número válido'}
    }
    #swagger.responses[404] = {
        description: 'Estudiante no encontrado',
        schema: {mensaje: 'Estudiante no encontrado'}
    }
    */
    const id = Number(req.params.id);
    if(isNaN(id)) {
        return res.status(400).json({error:"El parametro id debe ser un numero valido"})
    }

    const estudiante = listaEstudiantes.find((estudiante) => estudiante.id === id);
    if(!estudiante){
        return res.status(404).json({mensaje:"estudiante no encontrado"});
    }
    res.json(estudiante);
});

//Creando ruta HTTP
router.get("/server", (req:Request, res:Response) => {
    res.send("Servidor listo mi programador");
});

//Crear estudiante
router.post("/", (req:Request<{},{},crearEstudiante>, res:Response) =>{
    /*
    #swagger.tags = ['Estudiantes']
    #swagger.summary = 'Crear un nuevo estudiante'
    #swagger.description = 'Crear un nuevo estudiante con los datos proporcionados'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del estudiante a crear',
        required: true,
        schema: {pais: 'Bolivia', nombre: 'Kevin', edad: 23, activo: true, notas: [80, 90, 75], id: 1}
    }
    #swagger.responses[201] = {
        description: 'Estudiante creado exitosamente',
        schema: {pais: 'Bolivia', nombre: 'Kevin', edad: 23, activo: true, notas: [80, 90, 75], id: 1}
    }
    #swagger.responses[400] = {
        description: 'Error en los datos enviados',
        schema: {error: 'Faltan datos que son obligatorios'}
    }
    */
    const {nombre,pais,edad,notas} = req.body;
    if(!nombre || !pais || !edad) {
        return res.status(400).json({error: "Faltan datos que son obligatorios"});
    }
    const nuevoEstudiante:Estudiante = {
        id: listaEstudiantes.length > 0 ?listaEstudiantes.length + 1 : 1,
        nombre,
        pais,
        edad,
        activo: true,
        notas: notas?? [],
    };
    listaEstudiantes.push(nuevoEstudiante);
    res.status(201).json(nuevoEstudiante);

});

//Actualizamos estudiante
router.put("/:id", (req:Request<{id:string},{},actualizarEstudiante>, res:Response) => {
    /*
    #swagger.tags = ['Estudiantes']
    #swagger.summary = 'Actualizar un estudiante existente'
    #swagger.description = 'Actualizar un estudiante existente basado en su ID y los datos enviados en el cuerpo de la solicitud'
    #swagger.parameters[':id'] = {
        in: 'path',
        description: 'ID del estudiante a actualizar',
        required: true,
        type: 'integer'
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del estudiante a actualizar',
        required: true,
        schema: {pais: 'Bolivia', nombre: 'Kevin', edad: 23, activo: true, notas: [80, 90, 75] }
    }
    #swagger.responses[200] = {
        description: 'Estudiante actualizado exitosamente',
        schema: {pais: 'Bolivia', nombre: 'Kevin', edad: 23, activo: true, notas: [80, 90, 75] }
    }
    #swagger.responses[404] = {
        description: 'Estudiante no encontrado',
        schema: {error: 'Estudiante no encontrado'}
    }
    */
    const id = Number(req.params.id);
    const index = listaEstudiantes.findIndex((e) => e.id === id);
    if(index === -1) {
        return res.status(404).json({error: "Estudiante no encontrado"});
    }
    const {nombre,pais,edad,activo,notas} = req.body;

    listaEstudiantes[index] = {
        id:id,
        nombre:nombre ?? listaEstudiantes[index]?.nombre,
        pais:pais ?? listaEstudiantes[index]?.pais,
        edad:edad ?? listaEstudiantes[index]?.edad,
        activo:activo ?? listaEstudiantes[index]?.activo,
        notas:notas ?? listaEstudiantes[index]?.notas,
    };
    res.status(200).json(listaEstudiantes[index])
});

//Borramos estudiante
router.delete("/:id", (req:Request, res:Response) =>{
    /*
    #swagger.tags = ['Estudiantes']
    #swagger.summary = 'Eliminar un estudiante existente'
    #swagger.description = 'Eliminar un estudiante existente utilizando su ID'
    #swagger.parameters[':id'] = {
        in: 'path',
        description: 'ID del estudiante a eliminar',
        required: true,
        type: 'integer'
    }
    #swagger.responses[200] = {
        description: 'Estudiante eliminado exitosamente',
        schema: {message: 'Estudiante eliminado Exitosamente'}
    }
    #swagger.responses[404] = {
        description: 'Estudiante no encontrado',
        schema: {error: 'Estudiante no encontrado'}
    }
    */
    const id = Number(req.params.id);
    const index = listaEstudiantes.findIndex((e) => e.id === id);
    if(index === -1) {
        return res.status(404).json({error: "Estudiante no encontrado"});
    }
    const eliminado = listaEstudiantes[index];
    let listaNueva = listaEstudiantes.filter((e) => e.id !==id);
    setListaEstudiantes(listaNueva);
    res.status(200).json(`Estudiante eliminado Exitosamente ${eliminado?.nombre}`);
})

//rutas definidas anidadas
router.get("/:id/nota/:notaIndex", (req:Request<notasParams>, res:Response) => {
    /*
    #swagger.tags = ['Estudiantes']
    #swagger.summary = 'Obtener una nota específica de un estudiante'
    #swagger.description = 'Obtener una nota específica de un estudiante utilizando su ID y el índice de la nota'
    #swagger.parameters[':id'] = {
        in: 'path',
        description: 'ID del estudiante',
        required: true,
        type: 'integer'
    }
    #swagger.parameters[':notaIndex'] = {
        in: 'path',
        description: 'Índice de la nota a obtener',
        required: true,
        type: 'integer'
    }
    #swagger.responses[200] = {
        description: 'Nota obtenida exitosamente',
        schema: {estudiante: 'string', notaindice: 'integer', calificacion: 'number'}
    }
    #swagger.responses[400] = {
        description: 'Solicitud inválida',
        schema: {error: 'string'}
    }
    #swagger.responses[404] = {
        description: 'Estudiante o nota no encontrada',
        schema: {mensaje: 'string'}
    }
    */
    const id = Number(req.params.id);
    const index = Number(req.params.notaIndex);
    if(isNaN(id)) {
        return res.status(400).json({error:"El parametro id debe ser un numero valido"})
    }

    const estudiante = listaEstudiantes.find((estudiante) => estudiante.id === id);
    if(!estudiante){
        return res.status(404).json({mensaje:"estudiante no encontrado"});
    }
    if(index < 0 || index >= estudiante.notas.length){
        return res.status(400).json({error:"nota no valida"});
    }
    res.json({estudiante:estudiante.nombre, notaindice:index, calificacion:estudiante.notas[index]});
});

export default router;