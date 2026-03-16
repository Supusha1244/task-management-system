import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Task } from "../types/task";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(res.data);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  const createTask = async () => {
    if (!title) return;

    try {
      await API.post(
        "/tasks",
        { title },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Task added");
      setTitle("");
      fetchTasks();
    } catch {
      toast.error("Task creation failed");
    }
  };

  const updateTask = async (id: number) => {
    try {
      await API.put(
        `/tasks/${id}`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Task updated");

      setEditingTask(null);
      setTitle("");
      fetchTasks();
    } catch {
      toast.error("Update failed");
    }
  };

  const toggleTask = async (task: Task) => {
    await API.put(
      `/tasks/${task.id}`,
      { completed: !task.completed },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await API.delete(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Task deleted");

    fetchTasks();
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const filteredTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    });

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#667eea,#764ba2)",
        padding: "30px",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      <div className="container bg-white p-4 rounded shadow">
        <div className="d-flex justify-content-between mb-3">
          <h2 className="text-primary">Task Dashboard</h2>

          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>

        {/* Add or Edit Task */}

        <div className="input-group mb-3">
          <input
            className="form-control"
            placeholder="Enter task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {editingTask ? (
            <button
              className="btn btn-warning"
              onClick={() => updateTask(editingTask)}
            >
              Update
            </button>
          ) : (
            <button className="btn btn-success" onClick={createTask}>
              Add
            </button>
          )}
        </div>

        {/* Search */}

        <input
          className="form-control mb-3"
          placeholder="Search tasks..."
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter Buttons */}

        <div className="mb-3">
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className="btn btn-outline-success me-2"
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>

          <button
            className="btn btn-outline-warning"
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
        </div>

        {/* Task Cards */}

        <div className="row">
          {filteredTasks.map((task) => (
            <div key={task.id} className="col-md-4 col-sm-6 mb-3">
              <div
                className={`card shadow ${
                  task.completed ? "border-success" : "border-warning"
                }`}
              >
                <div className="card-body">
                  <h5 className="card-title">{task.title}</h5>

                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => toggleTask(task)}
                    >
                      {task.completed ? "Undo" : "Complete"}
                    </button>

                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => {
                        setEditingTask(task.id);
                        setTitle(task.title);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
