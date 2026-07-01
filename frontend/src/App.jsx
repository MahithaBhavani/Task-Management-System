import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;

    try {
      await axios.post(API, {
        title,
        status: "TODO",
      });

      setTitle("");
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (task, status) => {
    try {
      await axios.put(`${API}/${task.id}`, {
        title: task.title,
        status,
      });

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = async (task) => {
    if (!editTitle.trim()) return;

    try {
      await axios.put(`${API}/${task.id}`, {
        title: editTitle,
        status: task.status,
      });

      setEditingId(null);
      setEditTitle("");
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      filter === "ALL" ? true : task.status === filter;

    const searchMatch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return statusMatch && searchMatch;
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const todoCount = tasks.filter(
    (t) => t.status === "TODO"
  ).length;

  const progressCount = tasks.filter(
    (t) => t.status === "IN_PROGRESS"
  ).length;

  const completedCount = tasks.filter(
    (t) => t.status === "COMPLETED"
  ).length;

  return (
    <div className="container">
      <h1>Task Management System</h1>

      <div className="stats">
        <div className="statCard">
          <h3>{tasks.length}</h3>
          <p>Total</p>
        </div>

        <div className="statCard">
          <h3>{todoCount}</h3>
          <p>Todo</p>
        </div>

        <div className="statCard">
          <h3>{progressCount}</h3>
          <p>In Progress</p>
        </div>

        <div className="statCard">
          <h3>{completedCount}</h3>
          <p>Completed</p>
        </div>
      </div>

      <div className="inputBox">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task..."
        />

        <button
          className="addBtn"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter("ALL")}>
          All
        </button>

        <button onClick={() => setFilter("TODO")}>
          Todo
        </button>

        <button
          onClick={() =>
            setFilter("IN_PROGRESS")
          }
        >
          In Progress
        </button>

        <button
          onClick={() =>
            setFilter("COMPLETED")
          }
        >
          Completed
        </button>
      </div>

      <div className="searchBox">
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {filteredTasks.length === 0 ? (
        <p className="empty">
          No tasks found
        </p>
      ) : (
        filteredTasks.map((task) => (
          <div
            className="taskCard"
            key={task.id}
          >
            <div className="taskInfo">
              {editingId === task.id ? (
                <input
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(e.target.value)
                  }
                />
              ) : (
                <>
                  <h3>{task.title}</h3>

                  <span className="status">
                    {task.status}
                  </span>

                  <div className="date">
                    Created:{" "}
                    {new Date(
                      task.created_at
                    ).toLocaleDateString()}
                  </div>
                </>
              )}
            </div>

            <div className="actions">
              {editingId === task.id ? (
                <button
                  className="editBtn"
                  onClick={() =>
                    saveEdit(task)
                  }
                >
                  Save
                </button>
              ) : (
                <button
                  className="editBtn"
                  onClick={() =>
                    startEdit(task)
                  }
                >
                  Edit
                </button>
              )}

              <button
                className="progressBtn"
                onClick={() =>
                  updateStatus(
                    task,
                    "IN_PROGRESS"
                  )
                }
              >
                Progress
              </button>

              <button
                className="doneBtn"
                onClick={() =>
                  updateStatus(
                    task,
                    "COMPLETED"
                  )
                }
              >
                Done
              </button>

              <button
                className="deleteBtn"
                onClick={() =>
                  deleteTask(task.id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;