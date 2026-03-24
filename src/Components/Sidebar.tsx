import { useState } from 'react';
import { User, Project } from '../../types';
import ConfirmModal from "./ConfirmModal"

interface SidebarProps {
  users: User[];
  projects: Project[];
  currentUser: User;
  currentProject: Project | null;
  onSelectUser: (user: User) => void;
  onSelectProject: (project: Project) => void;
  onAddProject: (name: string) => void;
  onDeleteProject: (projectId: number) => void;
  onAddUser: (name: string) => void;
}

function AddProjectForm({ onAdd }: { onAdd: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handle = () => {
    if (!name.trim()) return;
    onAdd(name);
    setName('');
    setOpen(false);
  };

  if (!open) return (
    <button className="btn-add-project" onClick={() => setOpen(true)}>+ Nouveau projet</button>
  );

  return (
    <div className="add-project-form">
      <input
        className="ticket-edit-input"
        placeholder="Nom du projet"
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

function AddUserForm({ onAdd }: { onAdd: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handle = () => {
    if (!name.trim()) return;
    onAdd(name);
    setName('');
    setOpen(false);
  };

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

export default function Sidebar({
  users, projects, currentUser, currentProject,
  onSelectUser, onSelectProject, onAddProject, onDeleteProject, onAddUser
}: SidebarProps) {
  const userProjects = projects.filter(p => p.userId === currentUser.id);
  const [confirmDeleteProject, setConfirmDeleteProject] = useState<number | null>(null)

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">⬡</span>
        <span className="logo-text">DriftWork</span>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">Utilisateurs</p>
        <div className="user-list">
          {users.map(user => (
            <button
              key={user.id}
              className={`user-btn ${currentUser.id === user.id ? 'active' : ''}`}
              onClick={() => onSelectUser(user)}
            >
              <span className="user-avatar" style={{ background: user.color }}>{user.avatar}</span>
              <span className="user-name">{user.name}</span>
              {currentUser.id === user.id && <span className="user-active-dot">●</span>}
            </button>
          ))}
        </div>
        <AddUserForm onAdd={onAddUser} />
      </div>

      <div className="sidebar-section sidebar-projects">
        <p className="sidebar-label">Mes Projets</p>
        <div className="project-list">
          {userProjects.length === 0 && (
            <p className="no-projects">Aucun projet</p>
          )}
          {userProjects.map(project => (
            <div
              key={project.id}
              className={`project-item ${currentProject?.id === project.id ? 'active' : ''}`}
              onClick={() => onSelectProject(project)}
            >
              <span className="project-icon">▸</span>
              <span className="project-name">{project.name}</span>
              <button
                className="btn-icon project-delete"
                onClick={(e) => {e.stopPropagation();
                setConfirmDeleteProject(project.id);
              }}
                title="Supprimer"
              >✕</button>
            </div>
          ))}
        </div>
        <AddProjectForm onAdd={onAddProject} />
      </div>
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
