import express from "express"
import type { Request, Response } from "express"
import cors from "cors"
import fs from "fs"

const app = express()

app.use(cors())
app.use(express.json({ limit: "10mb" }))

const DATA_PATH = "./projects.json"

/* READ / WRITE */

function readData(): any {
  const raw = fs.readFileSync(DATA_PATH)
  return JSON.parse(raw.toString())
}

function writeData(data: any): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
}

/* GET DATA */

app.get("/data", (_req: Request, res: Response) => {
  const data = readData()
  res.json(data)
})

/* UPDATE PROJECT */

app.put("/projects/:id", (req: Request, res: Response) => {

  const data = readData()

  const projectId = Number(req.params.id)
  const updatedProject = req.body

  const index = data.projects.findIndex((p: any) => p.id === projectId)

  if (index !== -1) {
    data.projects[index] = updatedProject
    writeData(data)
  }

  res.json(updatedProject)
})

/* ADD PROJECT */

app.post("/projects", (req: Request, res: Response) => {

  const data = readData()
  const newProject = req.body

  data.projects.push(newProject)

  writeData(data)

  res.json(newProject)
})

/* DELETE PROJECT */

app.delete("/projects/:id", (req: Request, res: Response) => {

  const data = readData()

  const projectId = Number(req.params.id)

  data.projects = data.projects.filter((p: any) => p.id !== projectId)

  writeData(data)

  res.json({ success: true })
})

/* START SERVER */

app.listen(3000, () => {
  console.log("API running on http://localhost:3000")
})