from itertools import count

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from calculator import router as calculator_router

app = FastAPI(title="Todo & Calculator API")
app.include_router(calculator_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class TodoCreate(BaseModel):
    title: str


class Todo(BaseModel):
    id: int
    title: str
    done: bool = False


# In-memory store (resets when the container restarts)
todos: dict[int, Todo] = {}
_ids = count(1)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/todos", response_model=list[Todo])
def list_todos():
    return list(todos.values())


@app.post("/api/todos", response_model=Todo, status_code=201)
def create_todo(payload: TodoCreate):
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    todo = Todo(id=next(_ids), title=title)
    todos[todo.id] = todo
    return todo


@app.patch("/api/todos/{todo_id}", response_model=Todo)
def toggle_todo(todo_id: int):
    todo = todos.get(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    todo.done = not todo.done
    return todo


@app.delete("/api/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int):
    if todos.pop(todo_id, None) is None:
        raise HTTPException(status_code=404, detail="Todo not found")
