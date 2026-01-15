import type { Materia } from "../types/schedule";
import MateriaCard from "./MateriaCard";

interface Props {
    materias: Materia[];
}

const PanelMaterias = ({ materias }: Props) => {
    if (materias.length === 0){
        return <p>No hay materias aún</p>;
    }

    return (
        <div>
            {materias.map((materia) => (
                <MateriaCard key={materia.id} materia={materia} />
            ))}
        </div>
    );
};

export default PanelMaterias;