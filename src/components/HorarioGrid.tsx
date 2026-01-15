import CeldaHorario from "./CeldaHorario";
import type { HorarioState } from "../types/schedule";
import MateriaCard from "./MateriaCard";


const dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"];

const horas = Array.from({ length: 15 }, (_, i) => i + 7); // 7 a 21

interface Props {
    horario: HorarioState;
}

const HorarioGrid = ({ horario }: Props) => {
    return (
        <div className="horario-grid">
            {/* Encabezados */}
            <div className="horario-header">Hora</div>
            {dias.map((dia) => (
                <div key={dia} className="horario-header">{dia}</div>
            ))}

            {/* Filas */}
            {horas.map((hora) => (
                <>
                    {/* Hora */}
                    <div key={`hora-${hora}`} className="hora-label">{hora}:00</div>

                    {/* Celdas por día */}
                    {dias.map((dia) => {
                        const celdaId = `${dia}-${hora}`;
                        return (
                            <CeldaHorario key={celdaId} id={celdaId} className="horario-cell">
                                {horario[celdaId] && (
                                    <MateriaCard
                                        materia={horario[celdaId]}
                                        className="materia-en-celda"
                                    />
                                )}
                            </CeldaHorario>
                        )
                    })}
                </>
            ))}
        </div>
    );
};


export default HorarioGrid;