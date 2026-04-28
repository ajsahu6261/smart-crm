import React, { useState } from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const initialColumns = [
  { id: 'todo', title: 'To Do', items: [{ id: '1', content: 'Acme Corp - GST' }, { id: '2', content: 'John Doe - ITR' }] },
  { id: 'in_progress', title: 'In Progress', items: [{ id: '3', content: 'Tech LLC - Audit' }] },
  { id: 'done', title: 'Done', items: [{ id: '4', content: 'StartUp Inc - TDS' }] },
];

export const StaffKanban: React.FC = () => {
  const [columns, setColumns] = useState(initialColumns);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // A simplified drag logic assuming items can only be sorted within the same column for this MVP.
    // Full inter-column drag logic is more complex with dnd-kit.
    setColumns((prev) => {
      const newCols = [...prev];
      for (let col of newCols) {
        const oldIndex = col.items.findIndex(i => i.id === activeId);
        const newIndex = col.items.findIndex(i => i.id === overId);
        if (oldIndex !== -1 && newIndex !== -1) {
          col.items = arrayMove(col.items, oldIndex, newIndex);
        }
      }
      return newCols;
    });
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Kanban Board</h1>
        <p className="text-slate-500">Manage your tasks and workflow.</p>
      </div>

      <div className="flex gap-6 flex-1 overflow-x-auto pb-4">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          {columns.map(col => (
            <div key={col.id} className="flex-1 min-w-[300px] glass-panel p-4 flex flex-col">
              <h3 className="font-semibold text-slate-700 mb-4 px-2">{col.title} ({col.items.length})</h3>
              <div className="flex-1 flex flex-col gap-3">
                <SortableContext items={col.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                  {col.items.map(item => (
                    <SortableItem key={item.id} id={item.id} content={item.content} />
                  ))}
                </SortableContext>
              </div>
            </div>
          ))}
        </DndContext>
      </div>
    </div>
  );
};

const SortableItem = (props: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <p className="text-slate-700 font-medium">{props.content}</p>
    </div>
  );
};
