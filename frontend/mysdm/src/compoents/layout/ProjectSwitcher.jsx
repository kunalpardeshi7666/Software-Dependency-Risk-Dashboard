
import {useProject} from "../../context/ProjectProvider"
export default function ProjectSwitcher() {
  const { projects, currentProject, setCurrentProject, loadingProjects } = useProject();

  if (loadingProjects) {
    return (
      <div className="border px-3 py-1 rounded text-sm bg-gray-50">
        Loading...
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="border px-3 py-1 rounded text-sm bg-gray-50">
        No Projects
      </div>
    );
  }

  return (
    <select
      className="border px-2 py-1 rounded"
      value={currentProject?.id || currentProject?.projectID || ""}
      onChange={(e) => {
        const id = e.target.value;
        const found = projects.find((p) => String(p.id || p.projectID) === String(id));
        if (found) setCurrentProject(found);
      }}
      aria-label="Select Project"
    >
      {projects.map((p) => (
        <option key={p.id || p.projectID} value={p.id || p.projectID}>
          {p.name || p.projectName}
        </option>
      ))}
    </select>
  );
}
