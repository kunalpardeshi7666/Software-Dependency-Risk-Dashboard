namespace DependencySystem.API.Model
{
    public class ProjectTeamMember
    {
        public int ProjectID { get; set; }
        public Project Project { get; set; }

        public string UserID { get; set; }
        public ApplicationUser User { get; set; }

        public string Role { get; set; } = "Member";  // Optional: Lead/Member/Tester
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    }

}
