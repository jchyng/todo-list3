import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DropZoneProps {
  groupId: string;
  isOver?: boolean;
}

export function GroupInnerDropZone({ groupId, isOver: _isOver }: DropZoneProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `${groupId}-inner` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="h-0.5 w-full transition-all duration-200 ml-6 mr-4"
      {...attributes}
      {...listeners}
    />
  );
}

export function GroupBottomDropZone({ groupId, isOver: _isOver }: DropZoneProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `${groupId}-bottom` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="h-0.5 w-full transition-all duration-200 mr-4"
      {...attributes}
      {...listeners}
    />
  );
}