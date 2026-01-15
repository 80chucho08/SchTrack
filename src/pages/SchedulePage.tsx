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
        const targetId = over.id as string;

        const materia = materias.find((m) => m.id === materiaId);
        if (!materia) return;

        // soltar en el panel
        if (targetId === "panel-materias") {
            setHorario((prev) => {
                const newHorario = { ...prev };

                const previousCell = Object.entries(prev).find(
                    ([_, m]) => m.id === materiaId
                )?.[0];

                if (previousCell) {
                    delete newHorario[previousCell];
                }

                return newHorario;
            });

            return; // IMPORTANTE
        }

        //  soltar en una celda
        setHorario((prev) => {
            const newHorario = { ...prev };

            const previousCell = Object.entries(prev).find(
                ([_, m]) => m.id === materiaId
            )?.[0];

            if (previousCell) {
                delete newHorario[previousCell];
            }

            newHorario[targetId] = materia;

            return newHorario;
        });
    };

    const materiasEnHorario = new Set(
        Object.values(horario).map((m) => m.id)
    );



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
                <PanelMaterias
                    materias={materias.filter(
                        (materia) => !materiasEnHorario.has(materia.id)
                    )}
                />


                <h2>Horario</h2>
                <HorarioGrid horario={horario} />
            </DndContext>

        </div>
    );
}

export default SchedulePage;