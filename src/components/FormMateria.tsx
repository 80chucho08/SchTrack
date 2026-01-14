import type { FormEvent, ChangeEvent } from 'react';

interface Props {
    nombreMateria: string;
    onNombreChange: (value: string) => void;
    onSubmit: () => void;
}

const FormMateria = ({
    nombreMateria,
    onNombreChange,
    onSubmit,
}: Props) => {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder='Nombre de la materia'
                value={nombreMateria}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onNombreChange(e.target.value)
                } 
            />
            <button type='submit'>Agregar</button>
        </form>
    );
};

export default FormMateria;