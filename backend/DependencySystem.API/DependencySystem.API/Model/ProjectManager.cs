using DependencySystem.API.Model;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DependencySystem.API.Models
{
    public class ProjectManager
    {
        [Key]
        [Column(Order = 1)]
        public int ProjectID { get; set; }

        [Key]
        [Column(Order = 2)]
        public string UserID { get; set; } = string.Empty;

        public RoleType Role { get; set; } = RoleType.Manager;
        public bool IsLead { get; set; } = false;
        public DateTime AssignedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ProjectID")]
        public virtual Project? Project { get; set; }

        [ForeignKey("UserID")]
        public virtual ApplicationUser? User { get; set; }
    }

    public enum RoleType
    {
        Manager = 0,
        Architect = 1,
        Lead = 2,
        Reviewer = 3
    }
}