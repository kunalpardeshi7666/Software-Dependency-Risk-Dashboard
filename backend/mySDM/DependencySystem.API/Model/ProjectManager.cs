using DependencySystem.API.Model;

namespace DependencySystem.API.Models
{
    public class ProjectManager
    {
        public int ProjectID { get; set; }
        public string UserID { get; set; } = string.Empty;

        public RoleType Role { get; set; } = RoleType.Manager;
        public bool IsLead { get; set; } = false;
        public DateTime AssignedDate { get; set; } = DateTime.UtcNow;

        public Project Project { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
    }

    public enum RoleType
    {
        Manager = 0,
        Architect = 1,
        Lead = 2,
        Reviewer = 3
    }
}
