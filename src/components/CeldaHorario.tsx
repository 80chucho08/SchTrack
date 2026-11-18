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

    // Resalta la celda mientras se arrastra una materia encima
    const style: React.CSSProperties | undefined = isOver
        ? { backgroundColor: "#e0f2fe" }
        : undefined;

    return (
        <div ref={setNodeRef} style={style} className={className}>
            {children}
        </div>
    );
};

export default CeldaHorario;
