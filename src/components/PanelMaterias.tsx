import type { Materia } from "../types/schedule";

interface Props {
    materias: Materia[];
}

const PanelMaterias = ({ materias }: Props) => {
    if (materias.length === 0){
        return <p>No hay materias aún</p>;
    }

    return (
        <ul>
            {materias.map((materia) => (
                <li key={materia.id}>{materia.nombre}</li>
            ))}
        </ul>
    );
};

export default PanelMaterias;