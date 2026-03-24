import React, { useState } from 'react';
import { Project, Ticket } from '../../types';
import ColumnComponent from './Column';

interface BoardProps {
  project: Project;
  onUpdate: (updated: Project) => void;
}

export default function Board({ project, onUpdate }: BoardProps) {
  const [dragging, setDragging] = useState<{ ticketId: string; fromColumnId: string } | null>(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColTitle, setNewColTitle] = useState('');

  const handleDragStart = (_e: React.DragEvent, ticketId: string, fromColumnId: string) => {
    setDragging({ ticketId, fromColumnId });
  };

  const handleDrop = (_e: React.DragEvent, toColumnId: string, index: number) => {

    if (!dragging) return;

    const updated = {
      ...project,
      columns: project.columns.map(col => ({
        ...col,
        tickets: [...col.tickets]
      }))
    };

    const fromCol = updated.columns.find(c => c.id === dragging.fromColumnId);
    const toCol = updated.columns.find(c => c.id === toColumnId);

    if (!fromCol || !toCol) return;

    const fromIndex = fromCol.tickets.findIndex(
      t => t.id === dragging.ticketId
    );

    const [ticket] = fromCol.tickets.splice(fromIndex, 1);

    let insertIndex = index;

    if (fromCol.id === toCol.id && fromIndex < index) {
      insertIndex--;
    }

    toCol.tickets.splice(insertIndex, 0, ticket);

    onUpdate(updated);
    setDragging(null);
  };

  const handleDeleteTicket = (ticketId: string, columnId: string) => {
    const updated = {
      ...project,
      columns: project.columns.map(col =>
        col.id === columnId
          ? { ...col, tickets: col.tickets.filter(t => t.id !== ticketId) }
          : col
      ),
    };
    onUpdate(updated);
  };

  const handleUpdateTicket = (ticketId: string, columnId: string, changes: Partial<Ticket>) => {
    const updated = {
      ...project,
      columns: project.columns.map(col =>
        col.id === columnId
          ? { ...col, tickets: col.tickets.map(t => t.id === ticketId ? { ...t, ...changes } : t) }
          : col
      ),
    };
    onUpdate(updated);
  };

  const handleAddTicket = (columnId: string, ticket: Omit<Ticket, 'id'>) => {
    const newTicket: Ticket = { ...ticket, id: `t-${Date.now()}` };
    const updated = {
      ...project,
      columns: project.columns.map(col =>
        col.id === columnId
          ? { ...col, tickets: [...col.tickets, newTicket] }
          : col
      ),
    };
    onUpdate(updated);
  };

  const handleDeleteColumn = (columnId: string) => {
    const updated = { ...project, columns: project.columns.filter(c => c.id !== columnId) };
    onUpdate(updated);
  };

  const handleAddColumn = () => {
    if (!newColTitle.trim()) return;
    const newCol = { id: `col-${Date.now()}`, title: newColTitle, tickets: [] };
    onUpdate({ ...project, columns: [...project.columns, newCol] });
    setNewColTitle('');
    setAddingColumn(false);
  };

  return (
    <div className="board">
      {project.columns.map(col => (
        <ColumnComponent
          key={col.id}
          column={col}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDeleteTicket={handleDeleteTicket}
          onUpdateTicket={handleUpdateTicket}
          onAddTicket={handleAddTicket}
          onDeleteColumn={handleDeleteColumn}
        />
      ))}

      <div className="add-column-wrapper">
        {addingColumn ? (
          <div className="add-column-form">
            <input
              className="ticket-edit-input"
              placeholder="Nom de la colonne"
              value={newColTitle}
              onChange={e => setNewColTitle(e.target.value)}
              autoFocus
            />
            <div className="ticket-edit-actions">
              <button className="btn-save" onClick={handleAddColumn}>+ Créer</button>
              <button className="btn-cancel" onClick={() => setAddingColumn(false)}>✕</button>
            </div>
          </div>
        ) : (
          <button className="btn-add-column" onClick={() => setAddingColumn(true)}>
            + Nouvelle colonne
          </button>
        )}
      </div>
    </div>
  );
}
