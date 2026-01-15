import { useDraggable } from "@dnd-kit/core";
import type { Materia } from "../types/schedule";

interface Props {
  materia: Materia;
}

const MateriaCard = ({ materia }: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: materia.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

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
