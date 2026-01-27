import { useEffect, useState } from "react";

export default function TaskCreate({ onSave, editTask }) {
  const [taskName, setTaskName] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Low");
  const [moduleID, setModuleID] = useState(1);
  const [developerID, setDeveloperID] = useState(1);

  useEffect(() => {
    if (editTask) {
      setTaskName(editTask.taskName);
      setStatus(editTask.status);
      setPriority(editTask.priority);
      setModuleID(editTask.moduleID);
      setDeveloperID(editTask.developerID);
    }
  }, [editTask]);

  const handleSubmit = () => {
    onSave({
      taskName,
      status,
      priority,
      moduleID: Number(moduleID),
      developerID: Number(developerID)
    });

    setTaskName("");
    setStatus("Pending");
    setPriority("Low");
    setModuleID(1);
    setDeveloperID(1);
  };

  return (
    <>
      <h2>{editTask ? "Update Task" : "Create Task"}</h2>

      <div className="form-group">
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Pending</option>
          <option>InProgress</option>
          <option>Completed</option>
        </select>
      </div>

      <div className="form-group">
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      <div className="form-group">
        <input
          type="number"
          placeholder="Module ID"
          value={moduleID}
          onChange={(e) => setModuleID(e.target.value)}
        />
      </div>

      <div className="form-group">
        <input
          type="number"
          placeholder="Developer ID"
          value={developerID}
          onChange={(e) => setDeveloperID(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit}>
        {editTask ? "Update Task" : "Add Task"}
      </button>
    </>
  );
}
