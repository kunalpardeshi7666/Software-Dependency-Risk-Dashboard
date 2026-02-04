using DependencySystem.API.Model;
using DependencySystem.API.Models;

public class Project
{
    public int ProjectID { get; set; }
    public string ProjectName { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Status { get; set; } = null!;

    public ICollection<Module> Modules { get; set; } = new List<Module>();
    public ICollection<ProjectTeamMember> ProjectTeamMembers { get; set; }
        = new List<ProjectTeamMember>();

    // 🔴 THIS WAS MISSING
    public ICollection<ProjectManager> ProjectManagers { get; set; }
        = new List<ProjectManager>();
    public ICollection<ProjectStakeholder> ProjectStakeholders { get; set; }
    = new List<ProjectStakeholder>();

}
