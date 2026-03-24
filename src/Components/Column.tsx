import React, { useState } from 'react';
import { Column, Ticket } from '../../types';
import TicketCard from './TicketCard';
import ConfirmModal from "./ConfirmModal"

interface ColumnProps {
  column: Column;
  onDragStart: (e: React.DragEvent, ticketId: string, fromColumnId: string) => void;
  onDrop: (e: React.DragEvent, toColumnId: string, index: number) => void;
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
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [confirmDeleteColumn, setConfirmDeleteColumn] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

const handleDragLeave = (e: React.DragEvent) => {
  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
    setIsDragOver(false);
    setDropIndex(null);
  }
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
    >
      <div className="column-header">
        <div className="column-title-row">
          <span className="column-count">{column.tickets.length}</span>
          <h3 className="column-title">{column.title}</h3>
        </div>
        <button
          className="btn-icon delete-col"
          onClick={() => setConfirmDeleteColumn(true)}
          title="Supprimer colonne"
        >✕
        </button>
      </div>

      <div className="tickets-list">

        {column.tickets.map((ticket, index) => (
          <React.Fragment key={ticket.id}>

            {/* zone drop AVANT ticket */}
            <div
              className="drop-zone"
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setDropIndex(index);
              }}
              onDrop={(e) => {
                onDrop(e, column.id, index);
                setDropIndex(null);
              }}
            >
              {dropIndex === index && <div className="drop-indicator"></div>}
            </div>

            <TicketCard
              ticket={ticket}
              columnId={column.id}
              onDragStart={onDragStart}
              onDelete={onDeleteTicket}
              onUpdate={onUpdateTicket}
            />

          </React.Fragment>
        ))}

        {/* zone drop FIN */}
        <div
          className="drop-zone"
          onDragOver={(e) => {
            e.preventDefault();
            setDropIndex(column.tickets.length);
          }}
          onDrop={(e) => {
            onDrop(e, column.id, column.tickets.length);
            setDropIndex(null);
          }}
        >
          {dropIndex === column.tickets.length && (
            <div className="drop-indicator"></div>
          )}
        </div>

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

            {/* confirmation suppression colonne */}
      {confirmDeleteColumn && (
        <ConfirmModal
          message="Supprimer cette colonne ?"
          onCancel={() => setConfirmDeleteColumn(false)}
          onConfirm={() => {
            onDeleteColumn(column.id)
            setConfirmDeleteColumn(false)
          }}
        />
    )}
    </div>
  );
}
