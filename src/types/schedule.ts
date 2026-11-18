export interface Materia {
    id: string;
    nombre: string;
    color: string;
}

// Cada celda guarda su propia copia de la materia, así que la misma materia
// puede aparecer en varias celdas.
export type HorarioState = {
    [celdaId: string]: Materia;
}

// Datos adjuntos a cada tarjeta arrastrable (useDraggable `data`)
export type DragData =
    | { origen: "panel"; materia: Materia }
    | { origen: "celda"; materia: Materia; celdaId: string };
