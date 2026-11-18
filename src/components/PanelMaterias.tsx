import type { Materia } from "../types/schedule";
import MateriaCard from "./MateriaCard";
import { useDroppable } from "@dnd-kit/core";

interface Props {
    materias: Materia[];
    seleccion: string | null;
    onClickMateria: (materiaId: string) => void;
}

const PanelMaterias = ({ materias, seleccion, onClickMateria }: Props) => {
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
                materias.map((materia) => {
                    const dragId = `panel:${materia.id}`;
                    return (
                        <MateriaCard
                            key={materia.id}
                            dragId={dragId}
                            data={{ origen: "panel", materia }}
                            seleccionada={seleccion === dragId}
                            onClick={() => onClickMateria(materia.id)}
                        />
                    );
                })
            )}
        </div>
    );
};

export default PanelMaterias;
