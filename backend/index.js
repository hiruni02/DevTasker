const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running!' })
})

app.get('/tasks', (req, res) => {
  res.json([])
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})