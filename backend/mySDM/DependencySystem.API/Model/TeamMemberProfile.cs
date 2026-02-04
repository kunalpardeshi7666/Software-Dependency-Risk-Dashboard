using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DependencySystem.API.Model
{
    public class TeamMemberProfile
    {
        [Key]
        public int TeamMemberProfileID { get; set; }

        // ✅ Foreign key to Identity User
        [Required]
        public string UserID { get; set; } = string.Empty;

        [ForeignKey(nameof(UserID))]
        public ApplicationUser User { get; set; } = null!;

        // ✅ Profile fields
        [Required]
        public string FullName { get; set; } = string.Empty;

        public string? MobileNumber { get; set; }
        public int? Age { get; set; }

        public int? ExperienceYears { get; set; }
        public string? TechnicalSkills { get; set; }   // "React, .NET, MongoDB"
        public string? SelfIntroduction { get; set; }

        public DateTime? JoinDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
