import { User, Project } from '../../types';
import { useState } from 'react';

// Props du menu (données + fonctions du parent)
type Props = {
  onClose: () => void
  onChangeBackground: (bg: string) => void

  currentUser: User
  project: Project
  users: User[]
  onUpdateProject: (project: Project) => void
}

export default function BoardMenu({
  onClose,
  onChangeBackground,
  currentUser,
  project,
  users,
  onUpdateProject
}: Props) {

  const [selectedUsers, setSelectedUsers] = useState<number[]>(project.userIds);// Liste des utilisateurs ayant accès au projet
  const [isEditingAccess, setIsEditingAccess] = useState(false);// Mode édition des accès (true = modifier les membres)

  // Gestion upload image de fond
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = () => {
      const imageUrl = reader.result as string
      onChangeBackground(imageUrl)// envoie l'image au parent
    }

    reader.readAsDataURL(file)// convertit en base64
  }

  return (

    // Overlay (fond sombre) → clic ferme le menu
    <div className="board-menu-overlay" onClick={onClose}>

      {/* Menu principal */}
      <div className="board-menu" onClick={(e) => e.stopPropagation()}>{/* stopPropagation empêche la fermeture quand on clique dedans */}

        {/* HEADER */}
        <div className="menu-header">
          <span>Menu</span>
          <button onClick={onClose}>✕</button>
        </div>

        {/* CHANGEMENT BACKGROUND */}
        <h4>Changer le fond d'écran</h4>

        <div className="background-grid">
          {/* fonds prédéfinis */}
          <div className="bg-option bg1" onClick={() => onChangeBackground('bg1')} />
          <div className="bg-option bg2" onClick={() => onChangeBackground('bg2')} />
          <div className="bg-option bg3" onClick={() => onChangeBackground('bg3')} />
          <div className="bg-option bg4" onClick={() => onChangeBackground('bg4')} />
        </div>

        {/* IMPORT IMAGE */}
        <label className="upload-background">
          Importer une image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>

        {/* AFFICHAGE DES MEMBRES */}
        <h4>Membres du projet</h4>

        <div className="user-checkbox-list">
          {users
            // filtre uniquement les users du projet
            .filter(user => project.userIds.includes(user.id))
            .map(user => (
              <div
                key={user.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "5px"
                }}
              >
                <span>{user.name}</span>
                {user.id === project.ownerId && " 👑"}{/* couronne pour le propriétaire */}
              </div>
            ))}
        </div>

          {/* PARTIE OWNER (gestioni accès)*/}
          {currentUser.id === project.ownerId && (

            !isEditingAccess ? (

              // Bouton pour activer le mode édition
              <button
                className="btn-save"
                style={{ marginTop: "10px" }}
                onClick={() => setIsEditingAccess(true)}
              >
                Modifier les accès
              </button>

            ) : (

              <>
                <h4 style={{ marginTop: "15px" }}>Modifier les accès</h4>

                {/* Liste de tous les utilisateurs avec checkbox */}
                <div className="user-checkbox-list">
                  {users.map(user => (
                    <label key={user.id}>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        disabled={user.id === project.ownerId}
                        onChange={() => {
                          // ajoute ou retire un utilisateur
                          setSelectedUsers(prev =>
                            prev.includes(user.id)
                              ? prev.filter(id => id !== user.id)
                              : [...prev, user.id]
                          );
                        }}
                      />
                      {" "}{user.name}
                      {user.id === project.ownerId && " 👑"}
                    </label>
                  ))}
                </div>

                {/* Bouton sauvegarder */}
                <button
                  className="btn-save"
                  onClick={() => {

                    // met à jour le projet avec nouveaux accès
                    const updated = {
                      ...project,
                      userIds: selectedUsers
                    };

                    onUpdateProject(updated);

                    // revient en mode normal
                    setIsEditingAccess(false);
                  }}
                >
                  Sauvegarder
                </button>
              </>
            )
          )}

      </div>
    </div>
  )
}