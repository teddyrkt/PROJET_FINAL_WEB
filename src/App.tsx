import { useEffect, useState } from 'react';
import { AppData, Project, User } from '../types';
import './App.css';
import Board from './Board';
import Sidebar from './Sidebar';
import BoardMenu from './BoardMenu'

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/data")
      .then(r => r.json())
      .then((d: AppData) => {
        setData(d);
        setCurrentUser(d.users[0]);
        const firstProject = d.projects.find(p => p.userId === d.users[0].id) || null;
        setCurrentProject(firstProject);
        setLoading(false);
      });
  }, []);

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    const firstProject = data?.projects.find(p => p.userId === user.id) || null;
    setCurrentProject(firstProject);
  };

  const handleUpdateProject = (updated: Project) => {
    if (!data) return;

    const newProjects = data.projects.map(p =>
      p.id === updated.id ? updated : p
    );

    setData({ ...data, projects: newProjects });
    setCurrentProject(updated);

    fetch(`http://localhost:3000/projects/${updated.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updated)
    });
  };

  const handleAddProject = (name: string) => {
    if (!data || !currentUser) return;
    const newProject: Project = {
      id: Date.now(),
      userId: currentUser.id,
      name,
      background: "bg1",
      columns: [
        { id: `col-${Date.now()}-1`, title: 'À faire', tickets: [] },
        { id: `col-${Date.now()}-2`, title: 'En cours', tickets: [] },
        { id: `col-${Date.now()}-3`, title: 'Terminé', tickets: [] },
      ],
    };
    const newData = { ...data, projects: [...data.projects, newProject] };
    setData(newData)
    setCurrentProject(newProject)

    fetch("http://localhost:3000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newProject)
    })
  };

  const handleDeleteProject = (projectId: number) => {

    if (!data) return;

    const newProjects = data.projects.filter(p => p.id !== projectId);

    setData({
      ...data,
      projects: newProjects
    });

    if (currentProject?.id === projectId) {
      setCurrentProject(
        newProjects.find(p => p.userId === currentUser?.id) || null
      );
    }

    fetch(`http://localhost:3000/projects/${projectId}`, {
      method: "DELETE"
    });

  };

  if (loading) return (
    <div className="loading-screen">
      <div className="loader-ring" />
      <p>Chargement...</p>
    </div>
  );

  if (!data || !currentUser) return null;

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

      <Sidebar
        users={data.users}
        projects={data.projects}
        currentUser={currentUser}
        currentProject={currentProject}
        onSelectUser={handleSelectUser}
        onSelectProject={setCurrentProject}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
      />
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

              <div className="board-header-right">
                <div
                  className="board-user-badge"
                  style={{ background: currentUser.color }}
                >
                  {currentUser.avatar} {currentUser.name}
                </div>

                <button
                  className="menu-button"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  ⋯
                </button>
              </div>
            </header>
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
              />
            )}
            <Board project={currentProject} onUpdate={handleUpdateProject} />
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h2>Aucun projet sélectionné</h2>
            <p>Créez un nouveau projet depuis le panneau latéral</p>
          </div>
        )}
      </main>
    </div>
  );
}