import { useEffect, useRef } from "react";
import LogoMark from "./LogoMark";

interface Props {
    abierto: boolean;
    onCerrar: () => void;
    // Casilla "No volver a mostrar" (el estado vive en SchedulePage)
    noMostrar: boolean;
    onNoMostrarChange: (valor: boolean) => void;
}

const pasos = [
    {
        titulo: "Crea tus materias",
        texto: "Escribe el nombre, elige un color y pulsa Agregar.",
    },
    {
        titulo: "Arrástralas al horario",
        texto: "Cada materia del panel se puede colocar en todas las horas que necesites.",
    },
    {
        titulo: "Ajusta",
        texto: "Mueve una materia a otra celda arrastrándola, o regrésala al panel para quitarla.",
    },
    {
        titulo: "Elimina con dos clics",
        texto: "El primer clic muestra una ×; el segundo la borra, en el panel o en el horario.",
    },
    {
        titulo: "Exporta",
        texto: "Pulsa Exportar PNG para descargar tu horario como imagen.",
    },
];

// Usa <dialog> nativo: showModal() da fondo oscuro, foco atrapado y cierre con Escape.
const WelcomeModal = ({ abierto, onCerrar, noMostrar, onNoMostrarChange }: Props) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (abierto && !dialog.open) {
            dialog.showModal();
            // Foco en "Empezar" (React no pone el atributo autofocus en el DOM)
            dialog.querySelector<HTMLButtonElement>(".welcome-button")?.focus();
        }
        if (!abierto && dialog.open) dialog.close();
    }, [abierto]);

    return (
        <dialog
            ref={dialogRef}
            className="welcome-modal"
            aria-labelledby="welcome-title"
            // Escape o dialog.close() disparan "close"
            onClose={onCerrar}
            // Clic en el fondo (fuera de la tarjeta) cierra
            onClick={(e) => {
                if (e.target === e.currentTarget) dialogRef.current?.close();
            }}
        >
            <div className="welcome-card">
                <div className="welcome-header">
                    <LogoMark size={44} />
                    <div>
                        <h2 id="welcome-title">
                            Bienvenido a Sch<span>Track</span>
                        </h2>
                        <p>Arma tu horario escolar de forma visual y descárgalo como imagen.</p>
                    </div>
                </div>

                <ol className="welcome-steps">
                    {pasos.map((paso, i) => (
                        <li key={paso.titulo}>
                            <span className="welcome-step-num">{i + 1}</span>
                            <div>
                                <strong>{paso.titulo}</strong>
                                <p>{paso.texto}</p>
                            </div>
                        </li>
                    ))}
                </ol>

                <p className="welcome-note">
                    Tu horario se guarda automáticamente en este navegador.
                </p>

                <div className="welcome-footer">
                    <label className="welcome-check">
                        <input
                            type="checkbox"
                            checked={noMostrar}
                            onChange={(e) => onNoMostrarChange(e.target.checked)}
                        />
                        No volver a mostrar
                    </label>
                    <button
                        type="button"
                        className="welcome-button"
                        onClick={() => dialogRef.current?.close()}
                    >
                        Empezar
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default WelcomeModal;
