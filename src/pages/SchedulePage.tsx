import { useState } from 'react';
import type { Materia } from '../types/schedule';

const SchedulePage = () => {
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [nombreMateria, setNombreMateria] = useState("");

    const handleAgregarMateria = (e: React.FormEvent) => {
        e.preventDefault();

        if (nombreMateria.trim() === "") return;

        const nuevaMateria: Materia = {
            id: crypto.randomUUID(),
            nombre: nombreMateria.trim(),
        };

        setMaterias((prev) => [...prev, nuevaMateria]);
        setNombreMateria("");
    }
    return (
        <div>
            <h1>Mi horario</h1>
            <form onSubmit={handleAgregarMateria}>
                <input 
                    type="text" 
                    placeholder='Nombre de la materia'
                    value={nombreMateria}
                    onChange={(e) => setNombreMateria(e.target.value)}
                />

                <button type='submit'>Agregar</button>
            </form>


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