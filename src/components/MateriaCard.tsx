import { useDraggable } from "@dnd-kit/core";
import type { Materia } from "../types/schedule";

interface Props {
  materia: Materia;
}

const MateriaCard = ({ materia }: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: materia.id,
  });

  const style = {
    backgroundColor: materia.color,
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "grab",
    minWidth: "110px",
    
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    touchAction: "none",
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };



  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    >
      {materia.nombre}
    </div>
  );
};

export default MateriaCard;
