import express from "express"
import type { Request, Response } from "express"
import cors from "cors"
import fs from "fs"

const app = express()

// Permet d'autoriser les requêtes entre frontend et backend
app.use(cors())
// Permet d'autoriser les requêtes entre frontend et backend
app.use(express.json({ limit: "10mb" }))

// Chemin vers notre fichier JSON
const DATA_PATH = "./projects.json"


// Lire les données du fichier JSON
function readData(): any {
  const raw = fs.readFileSync(DATA_PATH)
  return JSON.parse(raw.toString())
}

// Écrire les données dans le fichier JSON
function writeData(data: any): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
}

// Récupérer toutes les données (users + projects)
app.get("/data", (_req: Request, res: Response) => {
  const data = readData()
  res.json(data)
})


/* ─── UTILISATEURS ─────────────────────────────────────────── */

// Créer un nouvel utilisateur
app.post("/users", (req: Request, res: Response) => {
  const data = readData()

  // Vérifie que le nom est bien envoyé
  if (!req.body.name) {
    return res.status(400).json({ error: "Name is required" })
  }

  // si oui, on le créer
  const newUser = {
    id: Date.now(), // identifiant unique basé sur le temps
    name: req.body.name,
    avatar: req.body.name[0].toUpperCase(),// Vérifie que le nom est bien envoyé
    color: "#" + Math.floor(Math.random() * 16777215).toString(16) // identifiant unique basé sur le temps
  }

  //Ajouut dans le tableau users
  data.users.push(newUser)
  
  //on sauvegarde et on retourne le nouvel user
  writeData(data)
  res.json(newUser)
})

/* ─── PROJETS ─────────────────────────────────────────── */

// Modifier un projet existant
app.put("/projects/:id", (req: Request, res: Response) => {

  const data = readData()

  const projectId = Number(req.params.id)// récupérer l'id dans l'URL
  const updatedProject = req.body// récupérer l'id dans l'URL

  // Trouver le projet à modifier
  const index = data.projects.findIndex((p: any) => p.id === projectId)

  // Trouver le projet à modifier
  if (index !== -1) {
    data.projects[index] = updatedProject
    writeData(data)
  }

  res.json(updatedProject)
})


// Ajouter un nouveau projet
app.post("/projects", (req: Request, res: Response) => {

  const data = readData()
  const newProject = req.body

  // Ajouter un nouveau projet
  data.projects.push(newProject)

  writeData(data)
  res.json(newProject)
})


// Supprimer un projet
app.delete("/projects/:id", (req: Request, res: Response) => {

  const data = readData()

  const projectId = Number(req.params.id)

  // Supprimer le projet avec cet id
  data.projects = data.projects.filter((p: any) => p.id !== projectId)

  writeData(data)

  res.json({ success: true })
})


/* ─── SERVEUR ─────────────────────────────────────────── */

// Démarrer le serveur sur le port 3000
app.listen(3000, () => {
  console.log("API running on http://localhost:3000")
})