import { useDraggable } from "@dnd-kit/core";
import type { Materia } from "../types/schedule";

interface Props {
  materia: Materia;
  className?: string;
}

const MateriaCard = ({ materia, className }: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: materia.id,
  });

  // Solo estilos dinámicos inline; el resto vive en App.css (.materia-card)
  const style: React.CSSProperties = {
    backgroundColor: materia.color,
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
      className={className ? `materia-card ${className}` : "materia-card"}
    >
      {materia.nombre}
    </div>
  );
};

export default MateriaCard;
