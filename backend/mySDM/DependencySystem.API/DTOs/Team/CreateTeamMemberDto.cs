namespace DependencySystem.API.DTOs.Team
{
    public class CreateTeamMemberDto
    {
        public string Email { get; set; }
        public string Password { get; set; } // optional (admin creates)
        public string Role { get; set; } = "Developer";
        public string FullName { get; set; }
    }
}
