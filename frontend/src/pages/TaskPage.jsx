import { useEffect, useState } from "react";
import TaskList from "../components/task/TaskList";
import TaskCreate from "../components/task/TaskCreate";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from "../services/taskService";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    getTasks()
      .then(res => setTasks(res.data))
      .catch(err => console.error("GET error", err));
  };

  const handleSave = (task) => {
    if (editTask) {
      updateTask(editTask.taskID, task)
        .then(() => {
          loadTasks();
          setEditTask(null);
        })
        .catch(err => console.error("UPDATE error", err));
    } else {
      createTask(task)
        .then(() => loadTasks())
        .catch(err => console.error("CREATE error", err));
    }
  };

  const handleDelete = (id) => {
    deleteTask(id)
      .then(() => loadTasks())
      .catch(err => console.error("DELETE error", err));
  };

  return (
    <div className="page">
      <div className="header">
        <h1>Software Dependency Risk Dashboard</h1>
      </div>

      <div className="card">
        <TaskCreate onSave={handleSave} editTask={editTask} />
      </div>

      <div className="card">
        <TaskList
          tasks={tasks}
          onEdit={setEditTask}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
