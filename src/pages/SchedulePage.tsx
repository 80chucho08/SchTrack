import { useState, useEffect } from 'react';
import type { Materia, HorarioState } from '../types/schedule';
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
    const [horario, setHorario] = useState<HorarioState>(() => {
        const stored = localStorage.getItem("horario");
        return stored ? JSON.parse(stored) : {};
    });
    const [nombreMateria, setNombreMateria] = useState("");

    useEffect(() => {
        localStorage.setItem("materias", JSON.stringify(materias));
    }, [materias]);

    useEffect(() => {
        localStorage.setItem("horario", JSON.stringify(horario));
    }, [horario]);

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

        if (!over) return;

        const materiaId = active.id as string;
        const celdaId = over.id as string;

        //para no sorbe escribir una celda ya ocupada
        if (horario[celdaId]) return;

        const materia = materias.find((m) => m.id === materiaId);
        if (!materia) return;

        // colocar la materia en el horario
        setHorario((prev) => ({
            ...prev,
            [celdaId]: materia,
        }));

        // quitar materia del panel
        setMaterias((prev) => prev.filter((m) => m.id !== materiaId));

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

                <h2>Horario</h2>
                <HorarioGrid horario={horario} />
            </DndContext>

        </div>
    );
}

export default SchedulePage;