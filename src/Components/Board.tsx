import React, { useState } from 'react';
import { Project, Ticket } from '../../types';
import ColumnComponent from './Column';

// Props : le projet + fonction pour le modifier
interface BoardProps {
  project: Project;
  onUpdate: (updated: Project) => void;
}

export default function Board({ project, onUpdate }: BoardProps) {
  // Ticket en cours de déplacement (drag & drop)
  const [dragging, setDragging] = useState<{ ticketId: string; fromColumnId: string } | null>(null);
  // État pour ajouter une colonne
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColTitle, setNewColTitle] = useState('');


  ///DRAG START ///

  // Quand on commence à déplacer un ticket
  const handleDragStart = (_e: React.DragEvent, ticketId: string, fromColumnId: string) => {
    setDragging({ ticketId, fromColumnId });
  };


  /// DROP ///
  const handleDrop = (_e: React.DragEvent, toColumnId: string, index: number) => {

    if (!dragging) return;// sécurité

    // Copie du projet (pour éviter mutation directe)
    const updated = {
      ...project,
      columns: project.columns.map(col => ({
        ...col,
        tickets: [...col.tickets]
      }))
    };

    // Colonnes source et destination
    const fromCol = updated.columns.find(c => c.id === dragging.fromColumnId);
    const toCol = updated.columns.find(c => c.id === toColumnId);

    if (!fromCol || !toCol) return;

    // Trouver l’index du ticket
    const fromIndex = fromCol.tickets.findIndex(
      t => t.id === dragging.ticketId
    );

    const [ticket] = fromCol.tickets.splice(fromIndex, 1);// Retirer le ticket de sa colonne d'origine

    let insertIndex = index;

    // Ajustement si même colonne
    if (fromCol.id === toCol.id && fromIndex < index) {
      insertIndex--;
    }

    toCol.tickets.splice(insertIndex, 0, ticket);// Insérer le ticket dans la nouvelle position

    onUpdate(updated); // Mettre à jour le projet
    setDragging(null); // Reset drag
  };


  /// SUPPRIMER TICKET ///
  const handleDeleteTicket = (ticketId: string, columnId: string) => {
    const updated = {
      ...project,
      columns: project.columns.map(col =>
        col.id === columnId // Si c'est la bonne colonne
          ? { ...col, tickets: col.tickets.filter(t => t.id !== ticketId) }// On enlève le ticket
          : col // Sinon on ne change rien
      ),
    };
    onUpdate(updated);
  };


  /// MODIFIER TICKET ///
  const handleUpdateTicket = (ticketId: string, columnId: string, changes: Partial<Ticket>) => {
    const updated = {
      ...project,
      columns: project.columns.map(col =>
        col.id === columnId // Bonne colonne
          ? { ...col,
             tickets: col.tickets.map(t => 
              // Si c'est le bon ticket → on le modifie
              t.id === ticketId 
                ? { ...t, ...changes } // fusion des nouvelles données
                : t) } // sinon on ne change pas
          : col
      ),
    };
    onUpdate(updated);
  };

  /// AJOUTER TICKET ///
  const handleAddTicket = (columnId: string, ticket: Omit<Ticket, 'id'>) => {

    // On crée un nouveau ticket avec un id unique en fonction de la date
    const newTicket: Ticket = { ...ticket, id: `t-${Date.now()}` };
    const updated = {
      ...project,
      columns: project.columns.map(col =>
        col.id === columnId
          ? { ...col, tickets: [...col.tickets, newTicket] }// On ajoute le ticket à la fin
          : col
      ),
    };
    onUpdate(updated);
  };


  /// SUPPR COLUMN ///
  const handleDeleteColumn = (columnId: string) => {
    const updated = { ...project, columns: project.columns.filter(c => c.id !== columnId) };// On garde toutes les colonnes sauf celle supprimée
    onUpdate(updated);
  };


  /// AJOUTER COLUMN ///
  const handleAddColumn = () => {
    if (!newColTitle.trim()) return; // Vérifie que le nom n'est pas vide
    const newCol = { id: `col-${Date.now()}`, title: newColTitle, tickets: [] };// Création nouvelle colonne en fonction de la date avec un id unique
    onUpdate({ ...project, columns: [...project.columns, newCol] });// On ajoute la colonne au projet

    // reset
    setNewColTitle('');
    setAddingColumn(false);
  };

  return (
    <div className="board">

      {/* Affichage des colonnes */}
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

      {/* Ajout colonne */}
      <div className="add-column-wrapper">
        {addingColumn ? (

          // formulaire
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

          // bouton
          <button className="btn-add-column" onClick={() => setAddingColumn(true)}>
            + Nouvelle colonne
          </button>
        )}
      </div>
    </div>
  );
}
