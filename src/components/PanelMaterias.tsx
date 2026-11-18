import type { Materia } from "../types/schedule";
import MateriaCard from "./MateriaCard";
import { useDroppable } from "@dnd-kit/core";

interface Props {
    materias: Materia[];
}

const PanelMaterias = ({ materias }: Props) => {
    // El droppable se registra siempre, aunque el panel esté vacío,
    // para poder regresar materias desde el horario.
    const { setNodeRef } = useDroppable({
        id: "panel-materias",
    });

    return (
        <div ref={setNodeRef} className="panel-materias">
            {materias.length === 0 ? (
                <p className="panel-vacio">No hay materias aún</p>
            ) : (
                materias.map((materia) => (
                    <MateriaCard key={materia.id} materia={materia} />
                ))
            )}
        </div>
    );
};

export default PanelMaterias;
