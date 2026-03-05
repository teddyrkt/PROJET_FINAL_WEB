# KanbanFlow — Gestionnaire de projets (type Trello)

## 🚀 Lancer le projet

```bash
npm install
npm run dev
```

Ouvre ensuite : http://localhost:5173

---

## 📁 Structure des fichiers

```
trello-project/
├── public/
│   └── projects.json         ← BASE DE DONNÉES (à modifier)
├── src/
│   ├── components/
│   │   ├── Board.tsx         ← Tableau Kanban + Drag & Drop
│   │   ├── Column.tsx        ← Colonne + ajout de tickets
│   │   ├── Sidebar.tsx       ← Panneau latéral (users + projets)
│   │   └── TicketCard.tsx    ← Carte ticket (édition, suppression)
│   ├── types.ts              ← Types TypeScript
│   ├── App.tsx               ← Composant principal
│   ├── App.css               ← Tous les styles (fond d'écran inclus)
│   ├── index.css             ← Reset CSS
│   └── main.tsx              ← Point d'entrée React
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## ✅ Fonctionnalités implémentées

### Obligatoires
- **Colonnes** : Affichage, ajout, suppression de colonnes
- **Cartes/Tickets** : Création, édition, suppression de tickets avec titre, description et priorité
- **Drag & Drop** : Glisser-déposer des tickets entre les colonnes (HTML5 natif, sans librairie)

### Backend simulé
- `public/projects.json` : fichier JSON qui simule la base de données
- Chargé au démarrage via `fetch()`
- Structure : `{ users, projects }` avec colonnes et tickets imbriqués

### Bonus ✨
- **Multi-utilisateurs** : 2 utilisateurs (Alice + Bob) avec leurs propres projets
- **Fond d'écran animé** : Gradient mesh animé + grille de points
- **Priorités des tickets** : Haute / Moyenne / Basse avec badges colorés
- **Interface dark luxe** : Polices Syne + DM Sans, effets glassmorphism

---

## 🎨 Design

- Thème **dark luxe** avec fond animé (gradient mesh + points)
- Police **Syne** pour les titres, **DM Sans** pour le texte  
- Effets **glassmorphism** sur les colonnes et la sidebar
- Animations CSS : hover, drag-over, loader

---

## 📝 Structure du projects.json

```json
{
  "users": [
    { "id": 1, "name": "Alice", "avatar": "A", "color": "#6C63FF" },
    { "id": 2, "name": "Bob",   "avatar": "B", "color": "#FF6584" }
  ],
  "projects": [
    {
      "id": 1,
      "userId": 1,
      "name": "Nom du projet",
      "columns": [
        {
          "id": "col-1-1",
          "title": "À faire",
          "tickets": [
            { "id": "t-1", "title": "Titre", "description": "...", "priority": "high" }
          ]
        }
      ]
    }
  ]
}
```

Priorités disponibles : `"high"` | `"medium"` | `"low"`
