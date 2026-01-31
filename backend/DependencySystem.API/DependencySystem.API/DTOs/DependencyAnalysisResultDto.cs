namespace DependencySystem.API.DTOs
{
    public class DependencyAnalysisResultDto
    {
        public string RepoUrl { get; set; } = "";
        public DateTime AnalyzedAt { get; set; } = DateTime.UtcNow;

        public int TotalPackages { get; set; }
        public int OutdatedPackages { get; set; }
        public int VulnerablePackages { get; set; }
        public int RiskScore { get; set; } // 0-100

        public List<DependencyPackageDto> Packages { get; set; } = new();
        public List<RiskSeverityCountDto> SeverityCounts { get; set; } = new();
    }
}
