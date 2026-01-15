import type { FormEvent, ChangeEvent } from 'react';

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

    return (
        <form 
            onSubmit={handleSubmit}
            className='form-materia'
        >
            <input
            className='form-input'
                type="text"
                placeholder='Nombre de la materia'
                value={nombreMateria}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onNombreChange(e.target.value)
                }
            />
            <input
            className='form-color'
                type="color"
                value={colorMateria}
                onChange={(e) => onColorChange(e.target.value)}
            />
            <button className="form-button" type='submit' disabled={!nombreMateria.trim()}>Agregar</button>
        </form>
    );
};

export default FormMateria;