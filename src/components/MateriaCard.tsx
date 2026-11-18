import { useDraggable } from "@dnd-kit/core";
import type { Materia } from "../types/schedule";

interface Props {
  materia: Materia;
  className?: string;
}

const MateriaCard = ({ materia, className }: Props) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: materia.id,
  });

  // El movimiento lo dibuja el DragOverlay de SchedulePage; aquí la tarjeta
  // original solo se atenúa mientras se arrastra.
  const classes = ["materia-card", className, isDragging && "is-dragging"]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ backgroundColor: materia.color }}
      className={classes}
      title={materia.nombre}
    >
      {materia.nombre}
    </div>
  );
};

export default MateriaCard;
