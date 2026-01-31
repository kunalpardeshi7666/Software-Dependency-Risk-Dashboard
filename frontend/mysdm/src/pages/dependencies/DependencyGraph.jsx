// import ReactFlow, { Background, Controls } from "reactflow";
//  import "reactflow/dist/style.css";
// import { useEffect, useState } from "react";

// import {api} from "../../api/axiosInstance";
// export default function DependencyGraph() {
//   const [nodes, setNodes] = useState([]);
//   const [edges, setEdges] = useState([]);

//   const projectId = 1; // legacy module uses int projectId

//   useEffect(() => {
//     api.get(`/dependency-graph/${projectId}`).then((res) => {
//       const n = res.data.nodes.map((x, i) => ({
//         id: String(x.id),
//         position: { x: 100 + i * 150, y: 100 },
//         data: { label: x.label },
//       }));

//       const e = res.data.edges.map((ed, i) => ({
//         id: `e${i}`,
//         source: String(ed.from),
//         target: String(ed.to),
//       }));

//       setNodes(n);
//       setEdges(e);
//     });
//   }, []);

//   return (
//     <div className="bg-white rounded shadow p-3 h-[600px]">
//       <h2 className="text-lg font-bold mb-3">Dependency Graph</h2>
//       <ReactFlow nodes={nodes} edges={edges} fitView>
//         <Background />
//         <Controls />
//       </ReactFlow>
//     </div>
//   );
// }
