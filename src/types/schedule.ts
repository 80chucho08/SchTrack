export interface Materia {
    id: string;
    nombre: string;
    color: string;
}

export type HorarioState = {
    [celdaId: string]: Materia;
}