import type { Materia } from "../types/schedule";
import MateriaCard from "./MateriaCard";
import { useDroppable } from "@dnd-kit/core";

interface Props {
    materias: Materia[];
}

const PanelMaterias = ({ materias }: Props) => {
    const { setNodeRef } = useDroppable({
        id: "panel-materias",
    });

    if (materias.length === 0) {
        return <p>No hay materias aún</p>;
    }

    return (
        <div ref={setNodeRef} className="panel-materias">
            {materias.map((materia) => (
                <MateriaCard key={materia.id} materia={materia} />
            ))}
        </div>
    );
};

export default PanelMaterias;