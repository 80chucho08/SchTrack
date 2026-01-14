import { useState, useEffect } from 'react';
import type { Materia } from '../types/schedule';
import FormMateria from '../components/FormMateria';
import PanelMaterias from '../components/PanelMaterias';

const SchedulePage = () => {
    const [materias, setMaterias] = useState<Materia[]>(() => {
        const stored = localStorage.getItem("materias");
        return stored ? JSON.parse(stored) : [];
    });
    const [nombreMateria, setNombreMateria] = useState("");

    useEffect(() => {
        localStorage.setItem("materias", JSON.stringify(materias));
    }, [materias]);

    const handleAgregarMateria = () => {
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
            <h2>Agregar materia</h2>
            <FormMateria 
                nombreMateria={nombreMateria}
                onNombreChange={setNombreMateria}
                onSubmit={handleAgregarMateria}
            />


            <h2>Materias</h2>
                <PanelMaterias materias={materias} />
        </div>
    );  
}

export default SchedulePage;