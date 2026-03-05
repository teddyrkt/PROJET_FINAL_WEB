import React, { useState } from 'react';
import { Ticket } from '../types';

interface TicketCardProps {
  ticket: Ticket;
  columnId: string;
  onDragStart: (e: React.DragEvent, ticketId: string, fromColumnId: string) => void;
  onDelete: (ticketId: string, columnId: string) => void;
  onUpdate: (ticketId: string, columnId: string, updated: Partial<Ticket>) => void;
}

const priorityConfig = {
  high:   { label: 'Haute',   color: '#ff4d6d', bg: 'rgba(255,77,109,0.12)' },
  medium: { label: 'Moyenne', color: '#f5a623', bg: 'rgba(245,166,35,0.12)' },
  low:    { label: 'Basse',   color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
};

export default function TicketCard({ ticket, columnId, onDragStart, onDelete, onUpdate }: TicketCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description);
  const [priority, setPriority] = useState(ticket.priority);
  const p = priorityConfig[ticket.priority];

  const handleSave = () => {
    onUpdate(ticket.id, columnId, { title, description, priority });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="ticket-card editing">
        <input
          className="ticket-edit-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Titre du ticket"
        />
        <textarea
          className="ticket-edit-textarea"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
        />
        <select
          className="ticket-edit-select"
          value={priority}
          onChange={e => setPriority(e.target.value as Ticket['priority'])}
        >
          <option value="high">Haute priorité</option>
          <option value="medium">Moyenne priorité</option>
          <option value="low">Basse priorité</option>
        </select>
        <div className="ticket-edit-actions">
          <button className="btn-save" onClick={handleSave}>✓ Sauvegarder</button>
          <button className="btn-cancel" onClick={() => setEditing(false)}>✕ Annuler</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="ticket-card"
      draggable
      onDragStart={e => onDragStart(e, ticket.id, columnId)}
    >
      <div className="ticket-priority-badge" style={{ color: p.color, background: p.bg }}>
        ● {p.label}
      </div>
      <h4 className="ticket-title">{ticket.title}</h4>
      {ticket.description && <p className="ticket-desc">{ticket.description}</p>}
      <div className="ticket-actions">
        <button className="btn-icon edit" onClick={() => setEditing(true)} title="Modifier">✎</button>
        <button className="btn-icon delete" onClick={() => onDelete(ticket.id, columnId)} title="Supprimer">🗑</button>
      </div>
    </div>
  );
}
