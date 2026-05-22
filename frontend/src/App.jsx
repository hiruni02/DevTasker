import { useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")

  // Fetch all tasks when page loads
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const res = await fetch("${API_URL}/tasks")
    const data = await res.json()
    setTasks(data)
  }

  // Create a new task
  const createTask = async () => {
    if (!title.trim()) return
    await fetch("${API_URL}/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    })
    setTitle("")
    fetchTasks()
  }

  // Toggle task complete
  const toggleTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "PATCH"
    })
    fetchTasks()
  }

  // Delete a task
  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE"
    })
    fetchTasks()
  }

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", fontFamily: "Arial" }}>
      <h1>Task Manager 📝</h1>

      {/* Add task input */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createTask()}
          style={{ flex: 1, padding: "10px", fontSize: "16px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button
          onClick={createTask}
          style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "16px" }}
        >
          Add
        </button>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <p style={{ color: "#888" }}>No tasks yet. Add one above!</p>
      ) : (
        tasks.map(task => (
          <div key={task.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", marginBottom: "8px", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px solid #eee" }}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
            <span style={{ flex: 1, fontSize: "16px", textDecoration: task.done ? "line-through" : "none", color: task.done ? "#888" : "#333" }}>
              {task.title}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              style={{ padding: "6px 12px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default App
