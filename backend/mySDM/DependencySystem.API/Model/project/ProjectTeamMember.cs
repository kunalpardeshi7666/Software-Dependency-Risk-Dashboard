using DependencySystem.API.Model.project.enums;

namespace DependencySystem.API.Model.project
{
    public class ProjectTeamMember
    {
        public int ProjectID { get; set; }
        public Project Project { get; set; } = null!;

        public string UserID { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = null!;

        // ✅ Real-world role support
        public TeamRole Role { get; set; } = TeamRole.Developer;
    }
}
