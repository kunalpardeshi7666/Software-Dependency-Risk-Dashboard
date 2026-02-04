namespace DependencySystem.API.DTOs.ProjectTeam
{
    public class AssignProjectTeamMemberDto
    {
        public string UserID { get; set; }
        public string TeamRole { get; set; } = "Member";
    }
}
