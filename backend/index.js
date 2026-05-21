const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Temporary in-memory storage (we'll replace with DB on Day 3)
let tasks = []
let nextId = 1

// GET all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks)
})

// POST create a task
app.post('/tasks', (req, res) => {
  const { title } = req.body
  if (!title) {
    return res.status(400).json({ error: 'Title is required' })
  }
  const task = {
    id: nextId++,
    title,
    done: false,
    created_at: new Date()
  }
  tasks.push(task)
  res.status(201).json(task)
})

// PATCH mark task complete
app.patch('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id))
  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }
  task.done = !task.done
  res.json(task)
})

// DELETE a task
app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id))
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' })
  }
  tasks.splice(index, 1)
  res.json({ message: 'Task deleted' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})