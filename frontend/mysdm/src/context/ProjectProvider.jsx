import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { projectApi } from "../api/projectApi";

const ProjectContext = createContext(null);

export function ProjectProviders({ children }) {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Load all projects from backend
  const loadProjects = async () => {
    try {
      setLoadingProjects(true);
      setError(null);

      const res = await projectApi.list();

      // supports both {data:[...]} OR plain array
      const list = res.data?.data || res.data || [];
      setProjects(list);

      // ✅ select default project if none selected
      if (list.length > 0) {
        const savedId = localStorage.getItem("currentProjectId");

        const found =
          list.find((p) => String(p.id) === String(savedId)) ||
          list.find((p) => String(p.projectID) === String(savedId)) ||
          list[0];

        setCurrentProject(found);
        localStorage.setItem(
          "currentProjectId",
          String(found.id || found.projectID)
        );
      } else {
        setCurrentProject(null);
        localStorage.removeItem("currentProjectId");
      }
    } catch (err) {
      setError(err);
      setProjects([]);
      setCurrentProject(null);
    } finally {
      setLoadingProjects(false);
    }
  };

  // ✅ set current project (and save in localStorage)
  const selectProjectById = (id) => {
    const found =
      projects.find((p) => String(p.id) === String(id)) ||
      projects.find((p) => String(p.projectID) === String(id));

    if (found) {
      setCurrentProject(found);
      localStorage.setItem("currentProjectId", String(found.id || found.projectID));
    }
  };

  // ✅ refresh projects list (re-fetch)
  const reloadProjects = async () => {
    await loadProjects();
  };

  // ✅ first load
  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      projects,
      currentProject,
      setCurrentProject,
      selectProjectById,
      loadingProjects,
      error,
      reloadProjects,
    }),
    [projects, currentProject, loadingProjects, error]
  );

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used inside ProjectProvider");
  return ctx;
};
