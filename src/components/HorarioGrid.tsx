const dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"];

const horas = Array.from({ length: 15 }, (_, i) => i+7); // 7 a 21

const HorarioGrid = () => {
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

                            return <td key={celdaId}>{celdaId}</td>
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};


export default HorarioGrid;