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

    const findMateriaCell = (materiaId: string) => {
        return Object.entries(horario).find(
            ([_, materia]) => materia.id === materiaId
        )?.[0];
    };

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
        const targetCellId = over.id as string;

        const materia = materias.find((m) => m.id === materiaId);
        if (!materia) return;

        setHorario((prev) => {
            const newHorario = { ...prev };

            // buscar si ya estaba colocada
            const previousCell = Object.entries(prev).find(
                ([_, m]) => m.id === materiaId
            )?.[0];

            // si estaba en otra celda, eliminarla
            if (previousCell) {
                delete newHorario[previousCell];
            }

            // colocar en la nueva celda
            newHorario[targetCellId] = materia;

            return newHorario;
        });
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