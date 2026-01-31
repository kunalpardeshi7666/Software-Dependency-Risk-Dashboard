import { useMemo, useState } from "react";

export default function Notifications() {
  const [filter, setFilter] = useState("All");

  // ✅ mock (later: GET /api/notifications)
  const [items] = useState([
    { id: 1, type: "Risk", msg: "Critical vulnerability found in lodash", time: "10:45 AM" },
    { id: 2, type: "Project", msg: "Project status changed to Active", time: "11:10 AM" },
    { id: 3, type: "Scan", msg: "New scan uploaded successfully", time: "12:05 PM" },
    { id: 4, type: "Auth", msg: "New user registered", time: "01:30 PM" },
  ]);

  const filtered = useMemo(() => {
    if (filter === "All") return items;
    return items.filter((x) => x.type === filter);
  }, [items, filter]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Notifications</h2>
          <p className="text-sm text-gray-600">System alerts & updates</p>
        </div>

        <select
          className="border rounded px-3 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter notifications"
        >
          <option>All</option>
          <option>Risk</option>
          <option>Scan</option>
          <option>Project</option>
          <option>Auth</option>
        </select>
      </div>

      <div className="bg-white rounded shadow p-4">
        <ul className="space-y-3">
          {filtered.map((n) => (
            <li key={n.id} className="border rounded p-3 flex justify-between">
              <div>
                <p className="font-medium">{n.msg}</p>
                <p className="text-xs text-gray-500">{n.type}</p>
              </div>
              <span className="text-xs text-gray-400">{n.time}</span>
            </li>
          ))}
          {!filtered.length && (
            <p className="text-sm text-gray-500">No notifications found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
