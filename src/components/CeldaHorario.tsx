import { useDroppable } from "@dnd-kit/core";

interface Props {
    id: string,
    children?: React.ReactNode;
    className?: string
}

const CeldaHorario = ({ id, children }: Props) => {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });

    const style: React.CSSProperties = {
        minWidth: "120px",
        height: "60px",
        backgroundColor: isOver ? "#e0f2fe" : "transparent",
        border: "1px solid #ccc",
        textAlign: "center",
        verticalAlign: "middle",
    };

    return (
        <td ref={setNodeRef} style={style} className="classname">
            {children}
        </td>
    );
};

export default CeldaHorario;