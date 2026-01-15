import { useDraggable } from "@dnd-kit/core";
import type { Materia } from "../types/schedule";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  materia: Materia;
}

const MateriaCard = ({ materia }: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: materia.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    border: "1px solid #ccc",
    padding: "8px",
    marginBottom: "6px",
    backgroundColor: "white",
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {materia.nombre}
    </div>
  );
};

export default MateriaCard;
