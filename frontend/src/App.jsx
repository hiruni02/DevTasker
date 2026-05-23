import { useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    const res = await fetch(`${API_URL}/tasks`)
    const data = await res.json()
    setTasks(data)
    setLoading(false)
  }

  const createTask = async () => {
    if (!title.trim()) return
    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    })
    setTitle("")
    fetchTasks()
  }

  const toggleTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: "PATCH" })
    fetchTasks()
  }

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" })
    fetchTasks()
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.done
    if (filter === "completed") return task.done
    return true
  })

  const completedCount = tasks.filter(t => t.done).length

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "40px 20px", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "white", fontSize: "36px", margin: "0 0 8px", fontWeight: "700" }}>📝 Task Manager</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}>{completedCount} of {tasks.length} tasks completed</p>
        </div>

        {/* Input Card */}
        <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.15)" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Add a new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createTask()}
              style={{ flex: 1, padding: "12px 16px", fontSize: "15px", borderRadius: "10px", border: "2px solid #e8e8e8", outline: "none", transition: "border 0.2s" }}
              onFocus={e => e.target.style.border = "2px solid #667eea"}
              onBlur={e => e.target.style.border = "2px solid #e8e8e8"}
            />
            <button
              onClick={createTask}
              style={{ padding: "12px 24px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "15px", fontWeight: "600" }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", justifyContent: "center" }}>
          {["all", "active", "completed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 20px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                background: filter === f ? "white" : "rgba(255,255,255,0.3)",
                color: filter === f ? "#667eea" : "white",
                transition: "all 0.2s"
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div style={{ background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.15)", minHeight: "200px" }}>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>⏳</div>
              <p>Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>🎉</div>
              <p>{filter === "completed" ? "No completed tasks yet!" : filter === "active" ? "No active tasks!" : "No tasks yet. Add one above!"}</p>
            </div>
          ) : (
            filteredTasks.map((task, index) => (
              <div
                key={task.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 16px",
                  marginBottom: index < filteredTasks.length - 1 ? "8px" : "0",
                  background: task.done ? "#f8f9ff" : "white",
                  borderRadius: "12px",
                  border: "2px solid",
                  borderColor: task.done ? "#e8e8ff" : "#f0f0f0",
                  transition: "all 0.2s"
                }}
              >
                {/* Checkbox */}
                <div
                  onClick={() => toggleTask(task.id)}
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    border: task.done ? "none" : "2px solid #ddd",
                    background: task.done ? "linear-gradient(135deg, #667eea, #764ba2)" : "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  {task.done && <span style={{ color: "white", fontSize: "12px" }}>✓</span>}
                </div>

                {/* Task info */}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 2px", fontSize: "15px", fontWeight: "500", textDecoration: task.done ? "line-through" : "none", color: task.done ? "#aaa" : "#333" }}>
                    {task.title}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#bbb" }}>
                    {formatDate(task.created_at)}
                  </p>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ padding: "6px 12px", background: "#fff0f0", color: "#ff4757", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.6)", marginTop: "20px", fontSize: "13px" }}>
          Built with React + Node.js + PostgreSQL + Docker 🐳
        </p>

      </div>
    </div>
  )
}

export default App
