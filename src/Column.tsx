import React, { useState } from 'react';
import { Column, Ticket } from '../types';
import TicketCard from './TicketCard';

interface ColumnProps {
  column: Column;
  onDragStart: (e: React.DragEvent, ticketId: string, fromColumnId: string) => void;
  onDrop: (e: React.DragEvent, toColumnId: string) => void;
  onDeleteTicket: (ticketId: string, columnId: string) => void;
  onUpdateTicket: (ticketId: string, columnId: string, updated: Partial<Ticket>) => void;
  onAddTicket: (columnId: string, ticket: Omit<Ticket, 'id'>) => void;
  onDeleteColumn: (columnId: string) => void;
}

export default function ColumnComponent({
  column, onDragStart, onDrop, onDeleteTicket, onUpdateTicket, onAddTicket, onDeleteColumn
}: ColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [addingTicket, setAddingTicket] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<Ticket['priority']>('medium');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    setIsDragOver(false);
    onDrop(e, column.id);
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddTicket(column.id, { title: newTitle, description: newDesc, priority: newPriority });
    setNewTitle('');
    setNewDesc('');
    setNewPriority('medium');
    setAddingTicket(false);
  };

  return (
    <div
      className={`column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <div className="column-title-row">
          <span className="column-count">{column.tickets.length}</span>
          <h3 className="column-title">{column.title}</h3>
        </div>
        <button className="btn-icon delete-col" onClick={() => onDeleteColumn(column.id)} title="Supprimer colonne">✕</button>
      </div>

      <div className="tickets-list">
        {column.tickets.map(ticket => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            columnId={column.id}
            onDragStart={onDragStart}
            onDelete={onDeleteTicket}
            onUpdate={onUpdateTicket}
          />
        ))}
      </div>

      {addingTicket ? (
        <div className="add-ticket-form">
          <input
            className="ticket-edit-input"
            placeholder="Titre du ticket *"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            autoFocus
          />
          <textarea
            className="ticket-edit-textarea"
            placeholder="Description (optionnel)"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
          />
          <select
            className="ticket-edit-select"
            value={newPriority}
            onChange={e => setNewPriority(e.target.value as Ticket['priority'])}
          >
            <option value="high">Haute priorité</option>
            <option value="medium">Moyenne priorité</option>
            <option value="low">Basse priorité</option>
          </select>
          <div className="ticket-edit-actions">
            <button className="btn-save" onClick={handleAdd}>+ Ajouter</button>
            <button className="btn-cancel" onClick={() => setAddingTicket(false)}>✕</button>
          </div>
        </div>
      ) : (
        <button className="btn-add-ticket" onClick={() => setAddingTicket(true)}>
          + Ajouter un ticket
        </button>
      )}
    </div>
  );
}
