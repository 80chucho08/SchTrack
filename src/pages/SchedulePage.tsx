import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import type { Materia, HorarioState, DragData } from '../types/schedule';
import FormMateria from '../components/FormMateria';
import PanelMaterias from '../components/PanelMaterias';
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import HorarioGrid from "../components/HorarioGrid";
import html2canvas from 'html2canvas';

const SchedulePage = () => {
    const horarioRef = useRef<HTMLDivElement>(null);
    const [materias, setMaterias] = useState<Materia[]>(() => {
        const stored = localStorage.getItem("materias");
        return stored ? JSON.parse(stored) : [];
    });

    const [horario, setHorario] = useState<HorarioState>(() => {
        const stored = localStorage.getItem("horario");
        return stored ? JSON.parse(stored) : {};
    });
    const [nombreMateria, setNombreMateria] = useState("");

    const [colorMateria, setColorMateria] = useState("#4f46e5"); // azul default

    const [materiaArrastrada, setMateriaArrastrada] = useState<Materia | null>(null);

    // Tarjeta marcada para eliminar (primer clic). Formato: "panel:<materiaId>" o "celda:<celdaId>"
    const [seleccion, setSeleccion] = useState<string | null>(null);

    // El arrastre empieza tras moverse 5px, así un clic simple no inicia un drag
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor),
    );


    useEffect(() => {
        localStorage.setItem("materias", JSON.stringify(materias));
    }, [materias]);

    useEffect(() => {
        localStorage.setItem("horario", JSON.stringify(horario));
    }, [horario]);

    // Clic fuera de la tarjeta seleccionada (o Escape) cancela la selección
    useEffect(() => {
        if (!seleccion) return;

        const handlePointerDown = (e: PointerEvent) => {
            if (!(e.target as Element).closest(".materia-card.is-selected")) {
                setSeleccion(null);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSeleccion(null);
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [seleccion]);

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

    // Primer clic: muestra la X. Segundo clic sobre la misma tarjeta: la elimina.
    const handleClickPanel = (materiaId: string) => {
        const key = `panel:${materiaId}`;
        if (seleccion === key) {
            setMaterias((prev) => prev.filter((m) => m.id !== materiaId));
            setSeleccion(null);
        } else {
            setSeleccion(key);
        }
    };

    const handleClickCelda = (celdaId: string) => {
        const key = `celda:${celdaId}`;
        if (seleccion === key) {
            setHorario((prev) => {
                const newHorario = { ...prev };
                delete newHorario[celdaId];
                return newHorario;
            });
            setSeleccion(null);
        } else {
            setSeleccion(key);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        const data = event.active.data.current as DragData | undefined;
        setMateriaArrastrada(data?.materia ?? null);
        setSeleccion(null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setMateriaArrastrada(null);
        const { active, over } = event;
        const data = active.data.current as DragData | undefined;

        if (!over || !data) return;

        const targetId = over.id as string;

        // soltar en el panel: si viene del horario, se quita de esa celda
        if (targetId === "panel-materias") {
            if (data.origen === "celda") {
                setHorario((prev) => {
                    const newHorario = { ...prev };
                    delete newHorario[data.celdaId];
                    return newHorario;
                });
            }
            return;
        }

        // soltar en una celda
        if (data.origen === "celda" && data.celdaId === targetId) return;

        setHorario((prev) => {
            const newHorario = { ...prev };

            // desde el horario: se mueve. Desde el panel: se coloca una copia
            // y la materia sigue disponible en el panel.
            if (data.origen === "celda") {
                delete newHorario[data.celdaId];
            }

            newHorario[targetId] = data.materia;
            return newHorario;
        });
    };

    const handleLimpiarPanel = () => {
        // El horario guarda copias de las materias, así que no se ve afectado
        setMaterias([]);
        setSeleccion(null);
    };

    const handleExportHorario = async () => {
        if (!horarioRef.current) return;

        // Quita la X de selección antes de capturar la imagen
        flushSync(() => setSeleccion(null));

        const canvas = await html2canvas(horarioRef.current, {
            scale: 2, // para mejor resolución
        });

        const imgData = canvas.toDataURL("image/png");

        // Crear link de descarga
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "horario.png";
        link.click();
    };




    return (
        <div>
            <header className="app-header">
                <div className="header-content">
                    <div className="brand">
                        <span className="brand-logo" aria-hidden="true">
                            {/* Icono de Calendario SVG */}
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </span>
                        <div className="brand-text">
                            <h1 className="app-title">SchTrack</h1>
                            <span className="app-subtitle">Organiza tu tiempo de forma visual</span>
                        </div>
                    </div>
                    <nav className="header-nav">
                        <button onClick={handleExportHorario} className="btn-export">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Exportar PNG
                        </button>
                    </nav>
                </div>
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

            <main className="main">
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={() => setMateriaArrastrada(null)}
                >
                    {/* Panel y botones arriba */}
                    <div className="top-section">
                        <div className="panel-section">
                            <h2>Panel Materias</h2>
                            <PanelMaterias
                                materias={materias}
                                seleccion={seleccion}
                                onClickMateria={handleClickPanel}
                            />
                        </div>

                        <aside className="actions">
                            <button onClick={handleLimpiarPanel} className="panel-button">
                                Limpiar panel
                            </button>
                            <button onClick={handleLimpiarHorario}>
                                Limpiar horario
                            </button>

                        </aside>
                    </div>

                    {/* Horario abajo */}
                    <div className="grid-section" ref={horarioRef}>
                        <h2>Horario</h2>
                        <HorarioGrid
                            horario={horario}
                            seleccion={seleccion}
                            onClickMateria={handleClickCelda}
                        />
                    </div>

                    <DragOverlay dropAnimation={null}>
                        {materiaArrastrada && (
                            <div
                                className="materia-card materia-overlay"
                                style={{ backgroundColor: materiaArrastrada.color }}
                            >
                                {materiaArrastrada.nombre}
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>
            </main>



            <footer className="app-footer">
                <div className="footer-content">
                    <div className="footer-info">
                        <p>© {new Date().getFullYear()} <strong>SchTrack</strong></p>
                        <span className="footer-dot" aria-hidden="true">·</span>
                        <p>Mejora tu horario escolar</p>
                    </div>

                    <div className="footer-links">
                        {/* LINK GITHUB */}
                        <a href="https://github.com/80chucho08" target="_blank" rel="noopener noreferrer" className="social-link">
                            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                            GitHub
                        </a>

                        {/* LINK LINKEDIN */}
                        <a href="https://linkedin.com/in/jesusalfonsonc" target="_blank" rel="noopener noreferrer" className="social-link">
                            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                            LinkedIn
                        </a>
                    </div>
                </div>
            </footer>

        </div>
    );
}

export default SchedulePage;