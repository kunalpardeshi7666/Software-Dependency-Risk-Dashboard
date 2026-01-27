export default function TaskList({ tasks, onEdit, onDelete }) {
  return (
    <>
      <h2>Task List</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Task Name</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Module ID</th>
            <th>Developer ID</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.taskID}>
              <td>{task.taskID}</td>
              <td>{task.taskName}</td>
              <td>{task.status}</td>
              <td>{task.priority}</td>
              <td>{task.moduleID}</td>
              <td>{task.developerID}</td>
              <td>
                <button
                  style={{ marginRight: "8px" }}
                  onClick={() => onEdit(task)}
                >
                  Edit
                </button>

                <button
                  style={{ backgroundColor: "#dc2626" }}
                  onClick={() => onDelete(task.taskID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
