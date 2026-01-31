// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// import { projectApi } from "../../api/projectApi";
// import {useProject} from "../../api/projectApi";
// export default function AuditLogs() {
//   const { currentProject } = useProject();
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const projectId = currentProject?.id;

//   useEffect(() => {
//     if (!projectId) return;

//     setLoading(true);
//     projectApi
//       .audit(projectId)
//       .then((res) => setLogs(res.data?.data || res.data || []))
//       .catch(() => toast.error("Failed to load audit logs"))
//       .finally(() => setLoading(false));
//   }, [projectId]);

//   return (
//     <div className="space-y-5">
//       <div>
//         <h2 className="text-xl font-bold">Project Audit Logs</h2>
//         <p className="text-sm text-gray-600">
//           Current Project: <b>{currentProject?.name || "N/A"}</b>
//         </p>
//       </div>

//       {loading ? (
//         <div className="bg-white p-4 rounded shadow">Loading logs...</div>
//       ) : (
//         <div className="bg-white rounded shadow overflow-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b text-left">
//                 <th className="p-3">User</th>
//                 <th className="p-3">Action</th>
//                 <th className="p-3">Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {logs.map((l, idx) => (
//                 <tr key={idx} className="border-b">
//                   <td className="p-3">{l.userId || l.UserId}</td>
//                   <td className="p-3">{l.action || l.Action}</td>
//                   <td className="p-3 text-gray-600">
//                     {l.timestamp || l.Timestamp}
//                   </td>
//                 </tr>
//               ))}

//               {!logs.length && (
//                 <tr>
//                   <td className="p-4 text-gray-500" colSpan={3}>
//                     No logs found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }






import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AuditLogs() {
  const { user } = useAuth();

  // ✅ mock logs (later from GET /api/projects/{projectId}/audit)
  const [logs] = useState([
    { id: 1, userId: "u1", action: "Project created", timestamp: "2026-01-30 10:10" },
    { id: 2, userId: "u2", action: "Member added as Developer", timestamp: "2026-01-30 10:20" },
    { id: 3, userId: "u1", action: "Status changed to Active", timestamp: "2026-01-30 10:30" },
    { id: 4, userId: "u3", action: "Scan uploaded successfully", timestamp: "2026-01-30 10:45" },
  ]);

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return logs.filter(
      (l) =>
        l.action.toLowerCase().includes(search.toLowerCase()) ||
        l.userId.toLowerCase().includes(search.toLowerCase())
    );
  }, [logs, search]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Project Audit Logs</h2>
        <p className="text-sm text-gray-600">
          Read-only activity tracking (role: {user?.role})
        </p>
      </div>

      <input
        className="border rounded px-3 py-2 w-full max-w-md"
        placeholder="Search action / userId..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search audit logs"
      />

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">User</th>
              <th className="p-3">Action</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-b">
                <td className="p-3 font-medium">{l.userId}</td>
                <td className="p-3">{l.action}</td>
                <td className="p-3 text-gray-600">{l.timestamp}</td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={3}>
                  No logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 border rounded p-3 text-xs text-gray-600">
        Backend mapping (later): <code>GET /api/projects/{`{projectId}`}/audit</code>
      </div>
    </div>
  );
}
