namespace DependencySystem.API.DTOs.ProjectTeam
{
    public class ProjectTeamMemberDto
    {
        public int ProjectID { get; set; }
        public string UserID { get; set; }

        public string Email { get; set; }
        public string FullName { get; set; }

        public string TeamRole { get; set; }
        public DateTime AssignedAt { get; set; }
    }
}
