import { useState } from 'react';
import type { Materia } from '../types/schedule';

const SchedulePage = () => {
    const [materias, setMaterias] = useState<Materia[]>([]);
    return (
        <div>
            <h1>Mi horario</h1>
            <h2>Materias</h2>

            <ul>
                {materias.map((materia) => (
                    <li key={materia.id}>{materia.nombre}</li>
                ))}
            </ul>
        </div>
    );
}

export default SchedulePage;