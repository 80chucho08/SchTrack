export interface Materia {
    id: string;
    nombre: string;
}

export type HorarioState = {
    [celdaId: string]: Materia;
}