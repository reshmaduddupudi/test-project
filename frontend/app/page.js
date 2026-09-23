"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  async function loadTodos() {
    try {
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error();
      setTodos(await res.json());
      setError("");
    } catch {
      setError("Could not reach the backend.");
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function addTodo(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    loadTodos();
  }

  async function toggleTodo(id) {
    await fetch(`/api/todos/${id}`, { method: "PATCH" });
    loadTodos();
  }

  async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    loadTodos();
  }

  return (
    <main className="container">
      <h1>Todo App</h1>
      <p className="subtitle">Next.js frontend · FastAPI backend</p>

      <form onSubmit={addTodo} className="form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="list">
        {todos.map((todo) => (
          <li key={todo.id}>
            <label className={todo.done ? "done" : ""}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              {todo.title}
            </label>
            <button className="delete" onClick={() => deleteTodo(todo.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && !error && <p className="empty">No todos yet.</p>}
    </main>
  );
}
