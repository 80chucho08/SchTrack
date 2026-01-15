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

    const [colorMateria, setColorMateria] = useState("#4f46e5"); // azul default


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
            color: colorMateria,
        };

        setMaterias((prev) => [...prev, nuevaMateria]);
        setNombreMateria("");
    }

    const handleLimpiarHorario = () => {
        setHorario({});
    };


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

    const handleLimpiarPanel = () => {
        // Solo dejo las materias que ya están en el horario
        const materiasEnHorarioIds = new Set(Object.values(horario).map(m => m.id));
        setMaterias(prev => prev.filter(m => materiasEnHorarioIds.has(m.id)));
    };



    return (
        <div>
            <header className='header'>
                <h1 className='header'>Mi horario</h1>
            </header>

            <section className='form-section'>
                <h2>Agregar materia</h2>
                <FormMateria
                    nombreMateria={nombreMateria}
                    onNombreChange={setNombreMateria}
                    colorMateria={colorMateria}
                    onColorChange={setColorMateria}
                    onSubmit={handleAgregarMateria}
                />
            </section>

            <main className='main'>
                <div className='grid-section'>
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

                <aside className='actions'>
                    <button onClick={handleLimpiarPanel} className='panel-button'>
                        Limpiar panel
                    </button>
                    <button onClick={handleLimpiarHorario}>
                        Limpiar horario
                    </button>
                </aside>
            </main>

        </div>
    );
}

export default SchedulePage;