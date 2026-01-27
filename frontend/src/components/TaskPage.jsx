import TaskList from "../components/task/TaskList";
import TaskCreate from "../components/task/TaskCreate";

export default function TaskPage() {
  return (
    <div className="page">
      <div className="header">
        <h1>Software Dependency Risk Dashboard</h1>
      </div>

      <div className="card">
        <TaskCreate />
      </div>

      <div className="card">
        <TaskList />
      </div>
    </div>
  );
}
