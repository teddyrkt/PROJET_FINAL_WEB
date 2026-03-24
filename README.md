# DriftWork — Gestionnaire de projets (type Trello)
Membres : Teddy Rakotoarivelo & Ouissal Jarrari

## Description

DriftWork est une application de gestion de projets inspirée de Trello.
Elle permet de créer des projets, gérer des tickets et collaborer entre plusieurs utilisateurs.

---

## Fonctionnalités implémentées

### Obligatoires
- **Colonnes** : Affichage, ajout, suppression de colonnes
- **Cartes/Tickets** : Création, édition, suppression de tickets
- **Drag & Drop** : Glisser-déposer des tickets entre les colonnes

### Backend simulé
- `public/projects.json` : fichier JSON qui simule la base de données
- Chargé au démarrage via `fetch()`
- Structure : `{ users, projects }` avec colonnes et tickets imbriqués

### Bonus 
- **Multi-utilisateurs** : Possibilité de créer des utilisateurs
- **Fond d'écran modifiable** : Couleurs proposées + possibilité d'importer image de fond
- **Possibilité de créer des projets communs** : Gestion des accès à un projet
- **Plusieurs champs dans un ticket** : Titre, Description (optionnel), Lien (optionnel), Priorité

---

## Technologies

### Frontend
- React
- TypeScript
- Vite
- CSS (custom, sans framework)

### Backend
- Node.js
- Express

### Autres
- HTML5 Drag & Drop API
- Fetch API (communication frontend/backend)
- File System (fs) pour la gestion du JSON

---

## Lancer le projet

### Frontend
Ouvrir un premier terminal a la racine du projet
npm install
npm run dev

### Backend
Ouvrir un second terminal
cd backend -> on va dans le dossier backend
npx ts-node server.ts
  ce qui retournera -> API running on http://localhost:3000

Puis cliquer sur le lien dans le premier terminal:
http://localhost:5173

---

## Structure des fichiers

```
PROJET_FINAL_WEB/
├── backend/
│   ├── server.ts         ← Backend Express (API)
│   ├── projects.json     ← Base de données (users + projects)
│   └── tsconfig.json
├── src/
│   ├── Components/
│   │   ├── Board.tsx         ← Logique principale (drag & drop, tickets)
│   │   ├── Column.tsx        ← Colonnes + gestion tickets
│   │   ├── Sidebar.tsx       ← Utilisateurs + projets
│   │   ├── TicketCard.tsx    ← Carte ticket
│   │   ├── BoardMenu.tsx     ← Menu (fond + accès)
│   │   └── ConfirmModal.tsx  ← Confirmation suppression
│   ├── App.tsx           ← Composant principal
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
└── types.ts
```

---

## Structure du projects.json

```json
{
  "users": [
    {
      "id": 1774370369556,
      "name": "Teddy",
      "avatar": "T",
      "color": "#20e607"
    },
    {
      "id": 1774371081920,
      "name": "Ouissal",
      "avatar": "O",
      "color": "#7c7417"
    }
  ],
  "projects": [
    {
      "id": 1774370921403,
      "ownerId": 1774370369556,
      "userIds": [
        1774370369556
      ],
      "name": "PITIE",
      "background": "bg1",
      "columns": [
        {
          "id": "col-1774370921403-1",
          "title": "À faire",
          "tickets": [
            {
              "title": "Voir le cours",
              "description": "Partie back",
              "link": "https://frequent-radon-414.notion.site/30118ba4a645808aa8a5c9e7a7a6e584?v=30118ba4a64580a8b0b8000c609f37a7",
              "priority": "high",
              "id": "t-1774371061874"
            }
          ]
        },
        {
          "id": "col-1774370921403-2",
          "title": "En cours",
          "tickets": []
        },
        {
          "id": "col-1774370921403-3",
          "title": "Terminé",
          "tickets": []
        }
      ]
    },
}
```
