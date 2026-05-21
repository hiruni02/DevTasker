const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Database connection
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'admin',
  password: 'password123',
  database: 'taskmanager'
})

// Create tasks table if it doesn't exist
const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      done BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)
  console.log('Tasks table ready!')
}

// GET all tasks
app.get('/tasks', async (req, res) => {
  const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC')
  res.json(result.rows)
})

// POST create a task
app.post('/tasks', async (req, res) => {
  const { title } = req.body
  if (!title) {
    return res.status(400).json({ error: 'Title is required' })
  }
  const result = await pool.query(
    'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
    [title]
  )
  res.status(201).json(result.rows[0])
})

// PATCH mark task complete
app.patch('/tasks/:id', async (req, res) => {
  const result = await pool.query(
    'UPDATE tasks SET done = NOT done WHERE id = $1 RETURNING *',
    [req.params.id]
  )
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Task not found' })
  }
  res.json(result.rows[0])
})

// DELETE a task
app.delete('/tasks/:id', async (req, res) => {
  const result = await pool.query(
    'DELETE FROM tasks WHERE id = $1 RETURNING *',
    [req.params.id]
  )
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Task not found' })
  }
  res.json({ message: 'Task deleted' })
})

app.listen(PORT, async () => {
  await createTable()
  console.log(`Server running on http://localhost:${PORT}`)
})