using DependencySystem.API.Models;
using Microsoft.AspNetCore.Identity;

namespace DependencySystem.API.Model
{
    public class ApplicationUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        // Add FullName property
        public string FullName => $"{FirstName} {LastName}".Trim();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLogin { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public virtual ICollection<ProjectManager> ProjectManagers { get; set; } = new List<ProjectManager>();
        public virtual ICollection<ProjectStakeholder> ProjectStakeholders { get; set; } = new List<ProjectStakeholder>();
    }
}