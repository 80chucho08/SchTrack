import { useDraggable } from "@dnd-kit/core";
import type { DragData } from "../types/schedule";

interface Props {
  // Id único del arrastrable: "panel:<materiaId>" o "celda:<celdaId>"
  dragId: string;
  data: DragData;
  className?: string;
  seleccionada?: boolean;
  onClick?: () => void;
}

const MateriaCard = ({ dragId, data, className, seleccionada, onClick }: Props) => {
  const { materia } = data;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: dragId,
    data,
  });

  // El movimiento lo dibuja el DragOverlay de SchedulePage. Desde el horario la
  // tarjeta original se atenúa; desde el panel se queda igual porque es una plantilla.
  const classes = [
    "materia-card",
    className,
    isDragging && data.origen === "celda" && "is-dragging",
    seleccionada && "is-selected",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      style={{ backgroundColor: materia.color }}
      className={classes}
      title={seleccionada ? `Clic de nuevo para eliminar "${materia.nombre}"` : materia.nombre}
    >
      <span className="materia-nombre">{materia.nombre}</span>
      {seleccionada && (
        <span className="materia-x" aria-label="Eliminar">
          ×
        </span>
      )}
    </div>
  );
};

export default MateriaCard;
