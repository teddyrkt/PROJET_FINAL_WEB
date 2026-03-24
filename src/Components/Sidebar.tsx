import { useState } from 'react';
import { User, Project } from '../../types';
import ConfirmModal from "./ConfirmModal"

// Props du Sidebar (données + fonctions venant du parent App)
interface SidebarProps {
  users: User[];
  projects: Project[];
  currentUser: User;
  currentProject: Project | null;
  onSelectUser: (user: User) => void;
  onSelectProject: (project: Project) => void;
  onAddProject: (name: string, userIds: number[]) => void;
  onDeleteProject: (projectId: number) => void;
  onAddUser: (name: string) => void;
}

/***FORMULAIRE AJOUT DE PROJET  ***/
function AddProjectForm({ onAdd, users, currentUser }: { 
  onAdd: (name: string, userIds: number[]) => void,
  users: User[],
  currentUser: User}) {
  const [open, setOpen] = useState(false);// afficher ou non le formulaire
  const [name, setName] = useState('');// nom du projet
  const [selectedUsers, setSelectedUsers] = useState<number[]>([currentUser.id]);// tab stocke les utilisateurs ayant accès au projet

  // Fonction pour créer le projet
  const handle = () => {
    if (!name.trim()) return;// Fonction pour créer le projet

    const finalUsers = selectedUsers.length
      ? selectedUsers
      : [currentUser.id]; // fallback si rien aucun users selectionné, alors on met le créateur

    onAdd(name, finalUsers);// créer le projet avec ce nom et ces utilisateurs

    setName('');
    setSelectedUsers([currentUser.id]);
    setOpen(false);// ferme le form
  };

  // bouton pour ouvrir le formulaire
  if (!open) return (
    <button className="btn-add-project" onClick={() => setOpen(true)}>+ Nouveau projet</button>
  );

  return (
    <div className="add-project-form">

      {/* Champ nom */}
      <input
        className="ticket-edit-input"
        placeholder="Nom du projet"
        value={name}
        onChange={e => setName(e.target.value)}
        autoFocus
        onKeyDown={e => e.key === 'Enter' && handle()}
      />

      {/* Liste des utilisateurs */}
      <div className="user-checkbox-list">
        {users.map(user => (
          <label key={user.id} style={{ display: "block", marginTop: "5px" }}>
            <input
              type="checkbox"
              checked={selectedUsers.includes(user.id)}
              onChange={() => {
                // ajoute ou enlève un utilisateur
                setSelectedUsers(prev =>
                  prev.includes(user.id)
                    ? prev.filter(id => id !== user.id)
                    : [...prev, user.id]
                );
              }}
            />
            {" "}{user.name}
          </label>
        ))}
      </div>

      {/* Boutons */}
      <div className="ticket-edit-actions">
        <button className="btn-save" onClick={handle}>Créer</button>
        <button className="btn-cancel" onClick={() => setOpen(false)}>✕</button>
      </div>
    </div>
  );
}


/***FORMULAIRE AJOUT DE PROJET  ***/
function AddUserForm({ onAdd }: { onAdd: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handle = () => {
    if (!name.trim()) return;
    onAdd(name);// appelle le parent
    setName('');
    setOpen(false);
  };

  // bouton pour ouvrir
  if (!open) return (
    <button
      className="btn-add-project add-user-btn"
      onClick={() => setOpen(true)}
    >
      + Nouvel utilisateur
    </button>
  );

  return (
    <div className="add-project-form">
      <input
        className="ticket-edit-input"
        placeholder="Nom utilisateur"
        value={name}
        onChange={e => setName(e.target.value)}
        autoFocus
        onKeyDown={e => e.key === 'Enter' && handle()}
      />
      <div className="ticket-edit-actions">
        <button className="btn-save" onClick={handle}>Créer</button>
        <button className="btn-cancel" onClick={() => setOpen(false)}>✕</button>
      </div>
    </div>
  );
}


/*** SIDEBAR PRINCIPALE  ***/
export default function Sidebar({
  users, projects, currentUser, currentProject,
  onSelectUser, onSelectProject, onAddProject, onDeleteProject, onAddUser
}: SidebarProps) {

  // Filtrer les projets accessibles à l'utilisateur actuel
  const userProjects = projects.filter(p => p.userIds?.includes(currentUser.id));
  const [confirmDeleteProject, setConfirmDeleteProject] = useState<number | null>(null)

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="logo-icon">⬡</span>
        <span className="logo-text">DriftWork</span>
      </div>

      {/* SECTION UTILISATEURS */}
      <div className="sidebar-section">
        <p className="sidebar-label">Utilisateurs</p>
        <div className="user-list">
          {/* Message si aucun utilisateur */}
            {users.length === 0 && (
              <p className="no-users">Aucun utilisateur</p>
            )}

          {/* Liste des utilisateurs */}
          {users.map(user => (
            <button
              key={user.id}
              className={`user-btn ${currentUser?.id === user.id ? 'active' : ''}`}
              onClick={() => onSelectUser(user)}
            >
              <span className="user-avatar" style={{ background: user.color }}>{user.avatar}</span>
              <span className="user-name">{user.name}</span>
              {/* Indique utilisateur actif */}
              {currentUser?.id === user.id && <span className="user-active-dot">●</span>}
            </button>
          ))}
        </div>

        {/* Bouton ajouter utilisateur */}
        <AddUserForm onAdd={onAddUser} />
      </div>

      {/* SECTION PROJETS */}
      <div className="sidebar-section sidebar-projects">
        <p className="sidebar-label">Mes Projets</p>
        <div className="project-list">

          {/* Message si aucun projet */}
          {userProjects.length === 0 && (
            <p className="no-projects">Aucun projet</p>
          )}

          {/* Liste des projets */}
          {userProjects.map(project => (
            <div
              key={project.id}
              className={`project-item ${currentProject?.id === project.id ? 'active' : ''}`}
              onClick={() => onSelectProject(project)}
            >
              <span className="project-icon">▸</span>
              <span className="project-name">
                {project.name}

                {/* Couronne si owner */}
                {project.ownerId === currentUser.id && " 👑"}
              </span>

              {/* Bouton supprimer (seulement owner) */}
              {project.ownerId === currentUser.id && (
                <button
                  className="btn-icon project-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteProject(project.id);
                  }}
                  title="Supprimer">✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Formulaire ajout projet (si user existe) */}
          {users.length > 0 && currentUser && (
            <AddProjectForm 
              onAdd={onAddProject}
              users={users}
              currentUser={currentUser}
            />
          )}
      </div>

      {/* Modal confirmation suppression */}
      {confirmDeleteProject !== null && (
        <ConfirmModal
          message="Supprimer ce projet ?"
          onCancel={() => setConfirmDeleteProject(null)}
          onConfirm={() => {
            onDeleteProject(confirmDeleteProject)
            setConfirmDeleteProject(null)
          }}
        />
)}
    </aside>
  );
}
