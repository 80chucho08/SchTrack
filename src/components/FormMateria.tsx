import type { FormEvent, ChangeEvent } from 'react';
import { coloresPredeterminados } from '../data/colores';

interface Props {
    nombreMateria: string;
    onNombreChange: (value: string) => void;
    colorMateria: string;
    onColorChange: (value: string) => void;
    onSubmit: () => void;
}

const FormMateria = ({
    nombreMateria,
    onNombreChange,
    colorMateria,
    onColorChange,
    onSubmit,
}: Props) => {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    const colorActual = colorMateria.toLowerCase();
    const esPersonalizado = !coloresPredeterminados.some((c) => c.valor === colorActual);

    return (
        <form
            onSubmit={handleSubmit}
            className='form-materia'
        >
            <div className="form-row">
                <input
                    className='form-input'
                    type="text"
                    placeholder='Nombre de la materia'
                    value={nombreMateria}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        onNombreChange(e.target.value)
                    }
                />
                <button className="form-button" type='submit' disabled={!nombreMateria.trim()}>Agregar</button>
            </div>

            <div className="color-swatches" role="group" aria-label="Color de la materia">
                {coloresPredeterminados.map((color) => (
                    <button
                        key={color.valor}
                        type="button"
                        className={`swatch${colorActual === color.valor ? " is-active" : ""}`}
                        style={{ backgroundColor: color.valor }}
                        onClick={() => onColorChange(color.valor)}
                        aria-label={color.nombre}
                        aria-pressed={colorActual === color.valor}
                        title={color.nombre}
                    />
                ))}

                {/* Selector libre: muestra el color elegido si no es uno de los predeterminados */}
                <label
                    className={`swatch swatch-custom${esPersonalizado ? " is-active" : ""}`}
                    style={esPersonalizado ? { background: colorMateria } : undefined}
                    title="Color personalizado"
                >
                    <input
                        type="color"
                        value={colorMateria}
                        onChange={(e) => onColorChange(e.target.value)}
                        aria-label="Color personalizado"
                    />
                </label>
            </div>
        </form>
    );
};

export default FormMateria;
