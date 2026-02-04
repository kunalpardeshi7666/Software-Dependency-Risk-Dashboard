import { createContext, useContext, useEffect, useState } from "react";
import { projectApi } from "../api/projectApi";

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const loadProjects = async () => {
    try {
      setLoadingProjects(true);

      const res = await projectApi.list();
      const list = res.data?.data || res.data || [];

      setProjects(list);

      // ✅ default project select
      if (list.length > 0 && !currentProject) {
        setCurrentProject(list[0]);
      }
    } catch (err) {
      console.error("Failed to load projects", err);
      setProjects([]);
      setCurrentProject(null);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line
  }, []);

  const value = {
    projects,            // all projects list
    currentProject,      // selected project
    setCurrentProject,   // update selected project
    loadingProjects,     // loading state
    reloadProjects: loadProjects, // manual reload
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

/**
 * ✅ Custom Hook
 * usage: const { currentProject } = useProject();
 */
export function useProject() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProject must be used inside <ProjectProvider>");
  }

  return context;
}
