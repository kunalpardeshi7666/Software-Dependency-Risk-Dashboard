namespace DependencySystem.API.DTOs.Team
{
    public class TeamMemberDto
    {
        public string UserID { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }

        public string FullName { get; set; }
        public string MobileNumber { get; set; }
        public int? Age { get; set; }
        public int? ExperienceYears { get; set; }
        public string TechnicalSkills { get; set; }
        public string SelfIntroduction { get; set; }
        public DateTime? JoinDate { get; set; }
    }
}
