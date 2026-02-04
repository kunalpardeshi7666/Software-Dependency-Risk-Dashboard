import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProjects } from "./hooks/useProjects";
// import { useProject } from "../../context/ProjectContext";
import ProjectsTable from "./ProjectsTable";
import CreateProjectModal from "./CreateProjectModal";
import AddModuleModal from "./AddModuleModal";
import AssignTeamModal from "./components/AssignTeamModal";



export default function ProjectsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    projects,
    loading,
    search,
    setSearch,
    filtered,
    createProject,
    updateProject,
    removeProject,
    changeStatus,
    createModuleForProject,
    teamModalProject,
    setTeamModalProject,
    addModuleProject,
    setAddModuleProject,
  } = useProjects(user);

  const canCreate = ["Admin", "Developer"].includes(user?.role);
  const readOnly = user?.role === "Tester";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Projects</h2>
          <p className="text-sm text-gray-600">
            {readOnly ? "Read-only mode (Tester)" : "Create and manage projects"}
          </p>
        </div>
        

        {canCreate && <CreateProjectModal onCreate={createProject} />}
      </div>

      {/* Search */}
      <input
        className="border rounded px-3 py-2 w-full max-w-md"
        placeholder="Search project..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <ProjectsTable
        loading={loading}
        projects={filtered}
        user={user}
        onView={(id) => navigate(`/projects/${id}`)}
        onEdit={updateProject}
        onDelete={removeProject}
        onChangeStatus={changeStatus}
        onAssignTeam={setTeamModalProject}
        onAddModule={setAddModuleProject}
      />

      {teamModalProject && (
        <AssignTeamModal
          project={teamModalProject}
          onClose={() => setTeamModalProject(null)}
        />
      )}

      {addModuleProject && (
        <AddModuleModal
          project={addModuleProject}
          onClose={() => setAddModuleProject(null)}
          onCreate={createModuleForProject}
        />
      )}
    </div>
  );
}
