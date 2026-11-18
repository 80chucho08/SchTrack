import CeldaHorario from "./CeldaHorario";
import type { HorarioState } from "../types/schedule";
import MateriaCard from "./MateriaCard";
import { Fragment } from "react/jsx-runtime";

// `id` forma parte del id de celda guardado en localStorage: no cambiarlo.
const dias = [
    { id: "LUNES", largo: "Lunes", corto: "Lun" },
    { id: "MARTES", largo: "Martes", corto: "Mar" },
    { id: "MIERCOLES", largo: "Miércoles", corto: "Mié" },
    { id: "JUEVES", largo: "Jueves", corto: "Jue" },
    { id: "VIERNES", largo: "Viernes", corto: "Vie" },
];

const horas = Array.from({ length: 15 }, (_, i) => i + 7); // 7 a 21

interface Props {
    horario: HorarioState;
}

const HorarioGrid = ({ horario }: Props) => {
    return (
        <div className="horario-grid">
            {/* Encabezados */}
            <div className="horario-header horario-corner" />
            {dias.map((dia) => (
                <div key={dia.id} className="horario-header">
                    <span className="dia-largo">{dia.largo}</span>
                    <span className="dia-corto">{dia.corto}</span>
                </div>
            ))}

            {/* Filas */}
            {horas.map((hora) => (
                <Fragment key={hora}>
                    <div className="hora-label">{hora}:00</div>

                    {dias.map((dia) => {
                        const celdaId = `${dia.id}-${hora}`;
                        return (
                            <CeldaHorario key={celdaId} id={celdaId} className="horario-cell">
                                {horario[celdaId] && (
                                    <MateriaCard
                                        materia={horario[celdaId]}
                                        className="materia-en-celda"
                                    />
                                )}
                            </CeldaHorario>
                        );
                    })}
                </Fragment>
            ))}
        </div>
    );
};

export default HorarioGrid;
