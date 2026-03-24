import React, { useState } from 'react';
import { Column, Ticket } from '../../types';
import TicketCard from './TicketCard';
import ConfirmModal from "./ConfirmModal"

// Props du composant Column
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
  const [isDragOver, setIsDragOver] = useState(false);// État pour savoir si un élément est au-dessus (drag)
  const [addingTicket, setAddingTicket] = useState(false);// État pour afficher le formulaire d'ajout

  // États du formulaire ticket
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<Ticket['priority']>('medium');
  const [newLink, setNewLink] = useState('');

  const [dropIndex, setDropIndex] = useState<number | null>(null);// Position du drop (où insérer le ticket)
  const [confirmDeleteColumn, setConfirmDeleteColumn] = useState(false)// Confirmation suppression colonne

  // Quand un élément est au-dessus de la colonne
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // obligatoire pour autoriser le drop
    setIsDragOver(true);
  };

  // Quand on sort de la colonne
  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setDropIndex(null);
    }
  };

  // Ajouter un ticket
  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddTicket(column.id, { title: newTitle, description: newDesc, link: newLink, priority: newPriority });

    // reset formulaire
    setNewTitle('');
    setNewDesc('');
    setNewLink('');
    setNewPriority('medium');
    setAddingTicket(false);
  };

  return (
    <div
      className={`column ${isDragOver ? 'drag-over' : ''}`} // style pendant drag
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >

      {/* HEADER COLONNE */}
      <div className="column-header">
        <div className="column-title-row">
          <span className="column-count">{column.tickets.length}</span>
          <h3 className="column-title">{column.title}</h3>
        </div>

        {/* bouton supprimer colonne */}
        <button
          className="btn-icon delete-col"
          onClick={() => setConfirmDeleteColumn(true)}
          title="Supprimer colonne"
        >✕
        </button>
      </div>

      {/* LISTE DES TICKETS */}
      <div className="tickets-list">

        {column.tickets.map((ticket, index) => (
          <React.Fragment key={ticket.id}>

            {/* zone de drop AVANT chaque ticket */}
            <div
              className="drop-zone"

              // Quand on passe un ticket au-dessus de cette zone
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setDropIndex(index);// position du drop
              }}

              // Quand on lâche le ticket
              onDrop={(e) => {
                onDrop(e, column.id, index);// déplacer ticket ici
                setDropIndex(null);// On reset l'indicateur visuel
              }}
            >
              {/* ligne visuelle quand on drag */}
              {dropIndex === index && <div className="drop-indicator"></div>}
            </div>

            {/* Ticket */}
            <TicketCard
              ticket={ticket}
              columnId={column.id}
              onDragStart={onDragStart}
              onDelete={onDeleteTicket}
              onUpdate={onUpdateTicket}
            />

          </React.Fragment>
        ))}

        {/* zone de drop à la FIN */}
        <div
          className="drop-zone"

          // Quand on passe un ticket au-dessus de cette zone
          onDragOver={(e) => {
            e.preventDefault();
            setDropIndex(column.tickets.length);
          }}

          // Quand on lâche le ticket
          onDrop={(e) => {
            onDrop(e, column.id, column.tickets.length);// déplacer ticket ici
            setDropIndex(null);// On reset l'indicateur visuel
          }}
        >
          {dropIndex === column.tickets.length && (
            <div className="drop-indicator"></div>
          )}
        </div>

      </div>

      {/* FORMULAIRE AJOUT TICKET */}
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
          <input
            className="ticket-edit-input"
            placeholder="Lien (optionnel)"
            value={newLink}
            onChange={e => setNewLink(e.target.value)}
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

          {/* boutons */}
          <div className="ticket-edit-actions">
            <button className="btn-save" onClick={handleAdd}>+ Ajouter</button>
            <button className="btn-cancel" onClick={() => setAddingTicket(false)}>✕</button>
          </div>
        </div>
      ) : (

        // bouton afficher formulaire
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
