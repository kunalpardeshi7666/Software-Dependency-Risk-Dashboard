import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { projectApi } from "../../../api/projectApi";
import { moduleApi } from "../../../api/moduleApi";

export function useProjects(user) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [teamModalProject, setTeamModalProject] = useState(null);
  const [addModuleProject, setAddModuleProject] = useState(null);

  const isAdmin = user?.role === "Admin";
  const isDev = user?.role === "Developer";
  const readOnly = user?.role === "Tester";
  const canCreate = isAdmin || isDev;

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await projectApi.list();
      setProjects(res.data || []);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filtered = useMemo(() => {
    return projects.filter((p) =>
      p.projectName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  const createProject = async (payload) => {
    if (!canCreate) return toast.error("Permission denied");
    await projectApi.create(payload);
    toast.success("Project created");
    loadProjects();
  };

  const updateProject = async (payload) => {
    if (readOnly) return toast.error("Read-only");
    await projectApi.update(payload.projectID, payload);
    toast.success("Project updated");
    loadProjects();
  };

  const changeStatus = async (project, status) => {
    if (readOnly) return toast.error("Read-only");
    await projectApi.update(project.projectID, { ...project, status });
    toast.success("Status updated");
    loadProjects();
  };

  const removeProject = async (id) => {
    if (!isAdmin) return toast.error("Admin only");
    if (!window.confirm("Delete project?")) return;
    await projectApi.remove(id);
    toast.success("Project deleted");
    loadProjects();
  };

  const createModuleForProject = async (payload) => {
    await moduleApi.create(payload);
    toast.success("Module created");
    setAddModuleProject(null);
  };

  return {
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
  };
}
