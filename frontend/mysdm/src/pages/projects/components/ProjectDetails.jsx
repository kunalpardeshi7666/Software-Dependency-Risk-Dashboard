import { useParams } from "react-router-dom";
import ProjectTeamSection from "./components/ProjectTeamSection";

export default function ProjectDetails() {
  const { id } = useParams(); // projectId

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Project Details</h2>

      {/* ✅ Project team assign UI */}
      <ProjectTeamSection projectId={id} />
    </div>
  );
}
