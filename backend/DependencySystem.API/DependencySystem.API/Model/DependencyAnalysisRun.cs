using System.ComponentModel.DataAnnotations;

namespace DependencySystem.API.Models
{
    public class DependencyAnalysisRun
    {
        [Key]
        public Guid RunId { get; set; }

        [Required]
        public string RepoUrl { get; set; } = "";

        public DateTime AnalyzedAt { get; set; } = DateTime.UtcNow;

        public int TotalPackages { get; set; }
        public int OutdatedPackages { get; set; }
        public int VulnerablePackages { get; set; }
        public int RiskScore { get; set; }

        public string CreatedByUserId { get; set; } = "";

        public string ResultJson { get; set; } = ""; // ✅ store full result JSON
    }
}
