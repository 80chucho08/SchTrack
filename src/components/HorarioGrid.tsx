import CeldaHorario from "./CeldaHorario";
import type { HorarioState } from "../types/schedule";


const dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"];

const horas = Array.from({ length: 15 }, (_, i) => i+7); // 7 a 21

interface Props {
    horario: HorarioState;
}

const HorarioGrid = ({horario}: Props) => {
    return (
        <table border={1} cellPadding={8}>
            <thead>
                <tr>
                    <th>Hora</th>
                    {dias.map((dia) => (
                        <th key={dia}>{dia}</th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {horas.map((hora) => (
                    <tr key={hora}>
                        <td>{hora}:00</td>

                        {dias.map((dia) => {
                            const celdaId = `${dia}-${hora}`;

                            return (
                                <CeldaHorario key={celdaId} id={celdaId}>
                                    {horario[celdaId]?.nombre || ""}
                                </CeldaHorario>
                            )
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};


export default HorarioGrid;