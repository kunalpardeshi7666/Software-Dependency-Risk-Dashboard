import { useEffect, useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import { dependencyApi } from "../../api/dependencyApi";
import { useProject } from "../../context/ProjectContext";
// import { useProject } from "../../context/ProjectProvider";
// import { useProjects } from "../../pages/projects/hooks/useProjects";
import { toast } from "react-toastify";

export default function DependencyGraph() {
  const { currentProject } = useProject();
  const projectId = currentProject?.id;

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    setLoading(true);

    dependencyApi
      .graph(projectId)
      .then((res) => {
        const data = res.data?.data || res.data;

        const n = (data?.nodes || []).map((x, i) => ({
          id: String(x.id),
          position: { x: 100 + i * 180, y: 120 },
          data: { label: x.label || x.name || `Node-${x.id}` },
        }));

        const e = (data?.edges || []).map((ed, i) => ({
          id: `e${i}`,
          source: String(ed.from || ed.source),
          target: String(ed.to || ed.target),
        }));

        setNodes(n);
        setEdges(e);
      })
      .catch(() => toast.error("Graph API failed"))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (!projectId) {
    return (
      <div className="bg-white p-4 rounded shadow">
        Please select a project first.
      </div>
    );
  }

  if (loading) {
    return <div className="bg-white p-4 rounded shadow">Loading graph...</div>;
  }

  return (
    <div className="bg-white rounded shadow p-3 h-[600px]">
      <h2 className="text-lg font-bold mb-3">Dependency Graph</h2>

      {/* ✅ Graph Visible Here */}
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
