import { useEffect, useRef, useState } from 'react';
import { AppData, Project, User } from '../types';
import './App.css';
import Board from './Components/Board';
import Sidebar from './Components/Sidebar';
import BoardMenu from './Components/BoardMenu'

export default function App() {
  const [data, setData] = useState<AppData | null>(null);// Données globales (users + projects)
  const [currentUser, setCurrentUser] = useState<User | null>(null);// Utilisateur sélectionné
  const [currentProject, setCurrentProject] = useState<Project | null>(null);// Projet sélectionné
  const [loading, setLoading] = useState(true);// État de chargement
  const [menuOpen, setMenuOpen] = useState(false);// Menu ouvert/fermé

  // ── Sidebar resize / collapse ──
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260);

  const isResizing = useRef(false);// savoir si on redimensionne
  const startX = useRef(0);// position souris départ
  const startWidth = useRef(0);// largeur départ

  // Gestion du resize de la sidebar
  const handleResizeStart = (e: React.MouseEvent) => {
    if (sidebarCollapsed) return;
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;

    // style curseur
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    const onMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;

      // calcule nouvelle largeur
      setSidebarWidth(Math.min(400, Math.max(180, startWidth.current + ev.clientX - startX.current)));
    };

    const onUp = () => {
      isResizing.current = false;

      // reset style
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  /// CHARGEMENT DONNÉES ///

  useEffect(() => {
    // Appel API backend
    fetch("http://localhost:3000/data")
      .then(r => r.json())
      .then((d: AppData) => {
        setData(d);

        // premier utilisateur
        setCurrentUser(d.users[0]);

        // premier projet accessible
        const firstProject = d.projects.find(p => p.userIds?.includes(d.users[0].id)) || null;
        setCurrentProject(firstProject);
        setLoading(false);
      });
  }, []);


  // CHANGER UTILISATEUR //
  const handleSelectUser = (user: User) => {
    setCurrentUser(user);

     // change projet automatiquement
    const firstProject = data?.projects.find(p => p.userIds?.includes(user.id)) || null;
    setCurrentProject(firstProject);
  };


  // MODIFIER PROJET //
  const handleUpdateProject = (updated: Project) => {
    if (!data) return;

    // met à jour localement
    const newProjects = data.projects.map(p =>
      p.id === updated.id ? updated : p
    );

    setData({ ...data, projects: newProjects });
    setCurrentProject(updated);

    // envoie au backend
    fetch(`http://localhost:3000/projects/${updated.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updated)
    });
  };

  // AJOUTER PROJET //
  const handleAddProject = (name: string, userIds: number[]) => {
    if (!data || !currentUser) return;

    // garantit que le créateur est dedans
    const finalUserIds = userIds.includes(currentUser.id)
      ? userIds
      : [...userIds, currentUser.id];

    const newProject: Project = {
      id: Date.now(),
      ownerId: currentUser.id, // créateur
      userIds: finalUserIds,   // accès
      name,
      background: "bg1",

      // colonnes par défaut créer 
      columns: [
        { id: `col-${Date.now()}-1`, title: 'À faire', tickets: [] },
        { id: `col-${Date.now()}-2`, title: 'En cours', tickets: [] },
        { id: `col-${Date.now()}-3`, title: 'Terminé', tickets: [] },
      ],
    };

    // mise à jour locale
    const newData = {
      ...data,
      projects: [...data.projects, newProject]
    };

    setData(newData);
    setCurrentProject(newProject);

    // envoi backend
    fetch("http://localhost:3000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newProject)
    });
  };


   // SUPPRIMER PROJET //
  const handleDeleteProject = (projectId: number) => {

    if (!data) return;

    const newProjects = data.projects.filter(p => p.id !== projectId);

    setData({
      ...data,
      projects: newProjects
    });

    if (currentProject?.id === projectId) {
      newProjects.find(p =>
        currentUser && p.userIds?.includes(currentUser.id)) || null;
    }

    // appel backend
    fetch(`http://localhost:3000/projects/${projectId}`, {
      method: "DELETE"
    });

  };


  // AJOUTER UTILISATEURS //
  const handleAddUser = async (name: string) => {
    if (!data) return;

    // envoi backend
    const res = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    });

    const newUser = await res.json();

    // mise à jour locale
    setData({
      ...data,
      users: [...data.users, newUser]
    });
    setCurrentUser(newUser);// devient utilisateur actif
  };


  // ECRAN DE CHARGEMENT //
  if (loading) return (
    <div className="loading-screen">
      <div className="loader-ring" />
      <p>Chargement...</p>
    </div>
  );

  
  if (!data) return null;

  // fallback utilisateur
  const user = currentUser || data.users[0];
  
  return (
      <div
        className={`app-layout ${
          currentProject?.background?.startsWith("data:")
            ? ""
            : currentProject?.background
        }`}
        style={
          currentProject?.background?.startsWith("data:")
            ? {
                backgroundImage: `url(${currentProject.background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }
            : {}
        }
      >

      {/* SIDEBAR */}
      <div
        className={`sidebar-wrapper${sidebarCollapsed ? ' collapsed' : ''}`}
        style={{ width: sidebarCollapsed ? 0 : sidebarWidth }}
      >
        <Sidebar
          users={data.users}
          projects={data.projects}
          currentUser={currentUser || data.users[0]}
          currentProject={currentProject}
          onSelectUser={handleSelectUser}
          onSelectProject={setCurrentProject}
          onAddProject={handleAddProject}
          onDeleteProject={handleDeleteProject}
          onAddUser={handleAddUser}
        />
        <div className="sidebar-resize-handle" onMouseDown={handleResizeStart} />
      </div>

      <button
        className="sidebar-toggle-btn"
        style={{ left: sidebarCollapsed ? 0 : sidebarWidth }}
        onClick={() => setSidebarCollapsed(c => !c)}
        title={sidebarCollapsed ? 'Afficher le panneau' : 'Masquer le panneau'}
      >
        {sidebarCollapsed ? '›' : '‹'}
      </button>

      {/* MAIN */}
      <main className="main-content">
        {currentProject ? (
          <>
            <header className="board-header">
              <div className="board-header-left">
                <h1 className="board-title">{currentProject.name}</h1>
                <span className="board-subtitle">
                  {currentProject.columns.reduce((acc, c) => acc + c.tickets.length, 0)} tickets au total
                </span>
              </div>

              {/* HEADER */}
              <div className="board-header-right">

                {/* utilisateur affiché */}
                <div
                  className="board-user-badge"
                  style={{ background: user.color }}
                >
                  {user.avatar} {user.name} {}
                </div>


                {/* bouton menu */}
                <button
                  className="menu-button"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  ⋯
                </button>
              </div>
            </header>

            {/* MENU */}
            {menuOpen && (
              <BoardMenu
                onClose={() => setMenuOpen(false)}
                onChangeBackground={(bg) => {
                  if (!currentProject) return

                  const updated = {
                    ...currentProject,
                    background: bg
                  }

                  handleUpdateProject(updated)
                }}

                currentUser={currentUser || data.users[0]}
                project={currentProject}
                users={data.users}
                onUpdateProject={handleUpdateProject}
              />
            )}

            {/* BOARD */}
            <Board project={currentProject} onUpdate={handleUpdateProject} />
          </>
        ) : (

          // écran vide
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h2>Aucun projet sélectionné</h2>
            <p>Créez un nouvel utilisateur si cela n’est pas déjà fait, ainsi qu’un projet depuis le panneau latéral</p>
          </div>
        )}
      </main>
    </div>
  );
}