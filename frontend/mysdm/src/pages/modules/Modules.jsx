import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const TECHS = ["React", "ASP.NET Core", "MongoDB", "SQL Server", "Node.js"];

export default function Modules() {
  const { user } = useAuth();

  const isAdmin = user?.role === "Admin";
  const isDev = user?.role === "Developer";
  const readOnly = user?.role === "Tester";

  const [projectId] = useState("p1"); // later from ProjectSwitcher context
  const [search, setSearch] = useState("");

  const [modules, setModules] = useState([
    {
      id: "m1",
      projectId: "p1",
      name: "Auth Service",
      description: "Login/Register/JWT",
      technologies: ["ASP.NET Core", "SQL Server"],
      riskScore: 65,
    },
    {
      id: "m2",
      projectId: "p1",
      name: "Dependency Scanner",
      description: "SBOM + Vulnerability scan",
      technologies: ["Node.js"],
      riskScore: 85,
    },
    {
      id: "m3",
      projectId: "p1",
      name: "Dashboard UI",
      description: "Charts + Widgets",
      technologies: ["React"],
      riskScore: 40,
    },
  ]);

  const filtered = useMemo(() => {
    return modules
      .filter((m) => m.projectId === projectId)
      .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
  }, [modules, projectId, search]);

  const createModule = (payload) => {
    if (!(isAdmin || isDev)) return toast.error("Only Admin/Developer allowed");
    const newModule = {
      id: `m${Math.floor(Math.random() * 99999)}`,
      projectId,
      name: payload.name,
      description: payload.description,
      technologies: payload.technologies,
      riskScore: Math.floor(Math.random() * 100),
    };
    setModules((p) => [newModule, ...p]);
    toast.success("Module created");
  };

  const deleteModule = (id) => {
    if (!isAdmin) return toast.error("Only Admin can delete module");
    setModules((p) => p.filter((m) => m.id !== id));
    toast.success("Module deleted");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Modules</h2>
          <p className="text-sm text-gray-600">
            {readOnly ? "Read-only mode (Tester)" : "Manage modules per project"}
          </p>
        </div>

        {(isAdmin || isDev) && (
          <CreateModuleModal onCreate={createModule} />
        )}
      </div>

      <div className="flex gap-3">
        <input
          className="border rounded px-3 py-2 w-full max-w-sm"
          placeholder="Search module..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search module"
        />
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Module</th>
              <th className="p-3">Technologies</th>
              <th className="p-3">Risk</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b">
                <td className="p-3">
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.description}</p>
                </td>

                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {m.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-gray-200 px-2 py-1 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      m.riskScore >= 80
                        ? "bg-red-100 text-red-700"
                        : m.riskScore >= 60
                        ? "bg-orange-100 text-orange-700"
                        : m.riskScore >= 40
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {m.riskScore}
                  </span>
                </td>

                <td className="p-3">
                  {isAdmin ? (
                    <button
                      onClick={() => deleteModule(m.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}

            {!filtered.length && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={4}>
                  No modules found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateModuleModal({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [tech, setTech] = useState([]);

  const toggleTech = (t) => {
    setTech((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));
  };

  const submit = () => {
    if (!name.trim()) return toast.error("Module name required");
    onCreate({ name: name.trim(), description: desc.trim(), technologies: tech });
    setOpen(false);
    setName("");
    setDesc("");
    setTech([]);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        + Create Module
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded shadow p-4 space-y-3">
            <h3 className="text-lg font-bold">Create Module</h3>

            <input
              className="border rounded w-full px-3 py-2"
              placeholder="Module name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              className="border rounded w-full px-3 py-2"
              rows={3}
              placeholder="Module description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <div>
              <p className="text-sm font-medium mb-2">Technologies</p>
              <div className="grid grid-cols-2 gap-2">
                {TECHS.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleTech(t)}
                    className={`border rounded px-3 py-2 text-sm text-left ${
                      tech.includes(t) ? "border-gray-900 bg-gray-50" : ""
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="border px-4 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={submit}
                className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
