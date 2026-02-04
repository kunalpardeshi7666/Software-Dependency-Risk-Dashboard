




import { useNavigate } from "react-router-dom";

export default function DeveloperDashboard() {
  const navigate = useNavigate();

  const myProjects = [
    { name: "Dependency Risk Dashboard", status: "Active", risk: "High" },
    { name: "Hotel Booking System", status: "Draft", risk: "Medium" },
      { name: "Hotel Booking System", status: "Draft", risk: "Medium" },
        { name: "Hotel Booking System", status: "Draft", risk: "Medium" },
          { name: "Hotel Booking System", status: "Draft", risk: "Medium" },
            { name: "Hotel Booking System", status: "Draft", risk: "Medium" },
              { name: "Hotel Booking System", status: "Draft", risk: "Medium" },
  ];

  const tasks = [
    { title: "Fix refresh token issue", status: "InProgress" },
    { title: "Implement scan upload UI", status: "Pending" },
    { title: "Module dependency mapping", status: "Pending" },
    { title: "Module dependency mapping", status: "Pending" },
    { title: "Module dependency mapping", status: "Pending" },
    { title: "Module dependency mapping", status: "Pending" },
    { title: "Module dependency mapping", status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Developer Dashboard</h2>
        <p className="text-sm text-gray-600">Projects, tasks and warnings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Projects */}
        <div className="bg-white rounded shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">My Projects</h3>
            <button
              onClick={() => navigate("/projects")}
              className="text-sm text-blue-600 hover:underline"
            >
              View all →
            </button>
          </div>

          <div className="space-y-2">
            {myProjects.map((p, i) => (
              <div
                key={i}
                className="border rounded p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-gray-500">Status: {p.status}</p>
                </div>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  Risk: {p.risk}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">My Tasks</h3>
            <button
              onClick={() => navigate("/tasks")}
              className="text-sm text-blue-600 hover:underline"
            >
              Task board →
            </button>
          </div>

          <div className="space-y-2">
            {tasks.map((t, i) => (
              <div key={i} className="border rounded p-3 flex justify-between">
                <span>{t.title}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warnings */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Dependency Warnings (Read-only)</h3>
        <p className="text-sm text-gray-600">
          You can view risk but cannot approve vulnerabilities.
        </p>

        <button
          onClick={() => navigate("/dependencies")}
          className="mt-3 bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Open Dependency Risks
        </button>
      </div>
    </div>
  );
}







// export default function DeveloperDashboard() {
//   return (
//     <div>
//       <h2 className="text-xl font-bold">Developer Dashboard</h2>
//       <p className="text-gray-600 mt-2">
//         Assigned projects, tasks, and dependency warnings will show here.
//       </p>
//     </div>
//   );
// }
