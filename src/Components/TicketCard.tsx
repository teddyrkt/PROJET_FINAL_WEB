import React, { useState } from 'react';
import { Ticket } from '../../types';
import ConfirmModal from "./ConfirmModal"

// Props du composant (données + fonctions)
interface TicketCardProps {
  ticket: Ticket;
  columnId: string;
  onDragStart: (e: React.DragEvent, ticketId: string, fromColumnId: string) => void;
  onDelete: (ticketId: string, columnId: string) => void;
  onUpdate: (ticketId: string, columnId: string, updated: Partial<Ticket>) => void;
}

// Configuration des priorités des taches (couleurs + labels)
const priorityConfig = {
  high:   { label: 'Haute',   color: '#ff4d6d', bg: 'rgba(255,77,109,0.12)' },
  medium: { label: 'Moyenne', color: '#f5a623', bg: 'rgba(245,166,35,0.12)' },
  low:    { label: 'Basse',   color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
};

export default function TicketCard({ ticket, columnId, onDragStart, onDelete, onUpdate }: TicketCardProps) {
  // État pour savoir si on est en mode édition
  const [editing, setEditing] = useState(false);

  // États pour modifier les données du ticket
  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description);
  const [link, setLink] = useState(ticket.link || '');
  const [priority, setPriority] = useState(ticket.priority);

  const p = priorityConfig[ticket.priority];// Récupère les infos de style selon la priorité
  const [confirmDelete, setConfirmDelete] = useState(false)// // État pour afficher la confirmation de suppression

  // Fonction appelée quand on sauvegarde les modifications
  const handleSave = () => {
    onUpdate(ticket.id, columnId, { title, description, link, priority });
    setEditing(false);
  };

  // MODE EDITION DU TICKET
  if (editing) {
    return (
      <div className="ticket-card editing">
        {/* Champ titre */}
        <input
          className="ticket-edit-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Titre du ticket"
        />

        {/* Champ description */}
        <textarea
          className="ticket-edit-textarea"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
        />

        {/* Champ lien */}
        <input
          className="ticket-edit-input"
          value={link}
          onChange={e => setLink(e.target.value)}
          placeholder="Lien (optionnel)"
        />

        {/* Sélection de la priorité */}
        <select
          className="ticket-edit-select"
          value={priority}
          onChange={e => setPriority(e.target.value as Ticket['priority'])}
        >
          <option value="high">Haute priorité</option>
          <option value="medium">Moyenne priorité</option>
          <option value="low">Basse priorité</option>
        </select>

        {/* Boutons confirmation*/}
        <div className="ticket-edit-actions">
          <button className="btn-save" onClick={handleSave}>✓ Sauvegarder</button>
          <button className="btn-cancel" onClick={() => setEditing(false)}>✕ Annuler</button>
        </div>
      </div>
    );
  }


  // MODE AFFICHAGE NORMAL
  return (
    <div
      className="ticket-card"
      draggable

      // Début du drag (on déplace le ticket)
      onDragStart={e => {
        document.body.classList.add('dragging');//change le style pendant le drag
        onDragStart(e, ticket.id, columnId);// Appelle la fonction du parent avec les infos du ticket déplacé (event, id, colonne)
      }}

      // Fin du drag ( on lâche le ticket)
      onDragEnd={() => {
        document.body.classList.remove('dragging');//remet le style normal
      }}
    >

      {/* Badge de priorité */}
      <div className="ticket-priority-badge" style={{ color: p.color, background: p.bg }}>
        ● {p.label}
      </div>

      {/* Titre */}
      <h4 className="ticket-title">{ticket.title}</h4>

      {/* Description (affichée seulement si elle existe) */}
      {ticket.description && 
        <p className="ticket-desc">
          {ticket.description}
        </p>
      }

      {/* Lien (si présent) */}
      {ticket.link && (
        <a
          href={ticket.link}
          target="_blank"
          rel="noopener noreferrer"
          className="ticket-link"
        >
          🔗 Ouvrir le lien
        </a>
      )}

      {/* Boutons modifier / supprimer */}
      <div className="ticket-actions">
        <button className="btn-icon edit" onClick={() => setEditing(true)} title="Modifier">✎</button>
        <button
          className="btn-icon delete"
          onClick={() => setConfirmDelete(true)}
        >
          🗑
        </button>
      </div>

      {/* Modal de confirmation suppression */}
      {confirmDelete && (
        <ConfirmModal
          message="Supprimer ce ticket ?"
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            onDelete(ticket.id, columnId)
            setConfirmDelete(false)
          }}
        />
      )}
    </div>
  );
}