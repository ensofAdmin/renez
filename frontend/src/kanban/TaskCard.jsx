// src/kanban/TaskCard.jsx
import { useDrag, useDrop } from "react-dnd";
import { DND_TYPES } from "./dndTypes";

import useAutoScroll from "./useAutoScroll";

export default function TaskCard({ task, index, columnId, actions, onOpen = () => {} }) {

  const [{ isDragging }, dragRef] = useDrag({
    type: DND_TYPES.TASK,
    item: {
      taskId: task.id,
      fromColumnId: columnId,
      index
    },
    canDrag: () => !actions.isModalOpen(),   // ⭐ prevent flicker
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useAutoScroll(isDragging && !actions.isModalOpen());

  const [, dropRef] = useDrop({
    accept: DND_TYPES.TASK,
    hover: (item, monitor) => {
      if (item.taskId === task.id) return;

      const fromColumnId = item.fromColumnId;
      const toColumnId = columnId;

      // ⭐ Same column → reorder
      if (fromColumnId === toColumnId) {
        actions.reorderTask(columnId, item.index, index);
        item.index = index; // update dragged item index
      }
    }
  });

  const ref = (node) => {
    dragRef(node);
    dropRef(node);
  };

  return (
    <div
      ref={ref}
      className={`task-card ${isDragging ? "dragging" : ""}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => onOpen(task)}
    >
      <div className={`task-priority task-priority-${task.priority}`}>
        {task.priority.toUpperCase()}
      </div>

      {task.title}
    </div>

  );
}
