import { useState, useEffect } from 'react';
import type { Materia } from '../types/schedule';
import FormMateria from '../components/FormMateria';
import PanelMaterias from '../components/PanelMaterias';
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import HorarioGrid from "../components/HorarioGrid";

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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        console.log("Materia arrastrada", active.id);
        console.log("Destino: ", over?.id);
    };
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
            <DndContext onDragEnd={handleDragEnd}>
                <PanelMaterias materias={materias} />
            </DndContext>

            <h2>Horario</h2>
            <HorarioGrid />

        </div>
    );
}

export default SchedulePage;