import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body
      if (!title || !description) {
        return res.writeHead(400).end(JSON.stringify({ message: 'Por favor envie um titulo e uma descrição para criar a tarefa.' }))
      }
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', {
        name: search,
        email: search,
      })

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const haveTask = database.find('tasks', id)

      if (!haveTask) {
        return res.writeHead(404).end(JSON.stringify({ message: 'Tarefa não encontrada.' }))
      }

      const updatedTask = database.update('tasks', id, {
        title,
        description,
      })

      return res.writeHead(200).end(JSON.stringify(updatedTask))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const haveTask = database.find('tasks', id)

      if (!haveTask) {
        return res.writeHead(404).end(JSON.stringify({ message: 'Tarefa não encontrada.' }))
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const haveTask = database.find('tasks', id)

      if (!haveTask) {
        return res.writeHead(404).end(JSON.stringify({ message: 'Tarefa não encontrada.' }))
      } else if (haveTask.completed_at) {
        return res.writeHead(403).end(JSON.stringify({ message: 'Esta tarefa já foi concluída.' }))
      }

      const completedTask = database.update('tasks', id, {
        completed_at: new Date().toISOString()
      })

      return res.writeHead(200).end(JSON.stringify(completedTask))
    }
  },
]