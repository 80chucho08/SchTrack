import { useDroppable } from "@dnd-kit/core";

interface Props {
    id: string,
    children?: React.ReactNode;
    className?: string
}

const CeldaHorario = ({ id, children, className }: Props) => {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });

    // .is-over resalta la celda mientras se arrastra una materia encima
    const classes = [className, isOver && "is-over"].filter(Boolean).join(" ");

    return (
        <div ref={setNodeRef} className={classes}>
            {children}
        </div>
    );
};

export default CeldaHorario;
