import { useEffect, useMemo, useState } from "react";
import ReactFlowGraph from "../components/graphs/ReactFlowGraph";
import D3ForceGraph from "../components/graphs/D3ForceGraph";
import SankeyGraph from "../components/graphs/SankeyGraph";
import { getDependencyGraph } from "../api/dependencyGraphApi";

export default function DependencyGraphPage({ projectId, role }) {
  const allowedTypes = useMemo(() => {
    if (role === "Admin") return ["reactflow", "d3", "sankey"];
    if (role === "Developer") return ["reactflow"];
    if (role === "Tester") return ["sankey"];
    return ["reactflow"];
  }, [role]);

  const [type, setType] = useState(allowedTypes[0]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setType(allowedTypes[0]);
  }, [allowedTypes]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await getDependencyGraph(projectId, type);
        setData(result);
      } catch (err) {
        console.error(err);
        alert("Failed to load dependency graph");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projectId, type]);

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700 }}>Dependency Graph</h2>
      <p style={{ marginTop: 4 }}>Role: <b>{role}</b></p>

      {/* Admin only chart selector */}
      {role === "Admin" && (
        <div style={{ margin: "12px 0" }}>
          <label style={{ marginRight: 8 }}>Chart Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {allowedTypes.map((t) => (
              <option key={t} value={t}>
                {t.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading && <p>Loading...</p>}

      {!loading && data && type === "reactflow" && <ReactFlowGraph data={data} />}
      {!loading && data && type === "d3" && <D3ForceGraph data={data} />}
      {!loading && data && type === "sankey" && <SankeyGraph data={data} />}
    </div>
  );
}
