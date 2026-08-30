export interface Estudiante{
    id:number; 
    nombre:string;
    email:string;
    bootcamp: string;
}
export interface crearEstudiante{
    nombre:string;
    email:string;
    bootcamp: string;
}
export interface actualizarEstudiante{
    nombre:string;
    email:string;
    bootcamp: string;
}

export interface estudianteFiltrado{
    nombre?:string;
    email?:string;
    bootcamp?: string;
}