using DependencySystem.API.Model;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DependencySystem.API.Models
{
    public class ProjectStakeholder
    {
        [Key]
        [Column(Order = 1)]
        public int ProjectID { get; set; }

        [Key]
        [Column(Order = 2)]
        public string UserID { get; set; } = string.Empty;

        public StakeholderType Type { get; set; }
        public string? Department { get; set; }
        public bool ReceivesUpdates { get; set; } = true;
        public DateTime AddedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ProjectID")]
        public virtual Project? Project { get; set; }

        [ForeignKey("UserID")]
        public virtual ApplicationUser? User { get; set; }
    }

    public enum StakeholderType
    {
        Client = 0,
        BusinessAnalyst = 1,
        ProductOwner = 2,
        QA = 3,
        DevOps = 4,
        Support = 5
    }
}