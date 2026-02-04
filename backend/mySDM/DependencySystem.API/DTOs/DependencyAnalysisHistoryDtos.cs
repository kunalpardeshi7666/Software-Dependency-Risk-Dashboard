namespace DependencySystem.API.DTOs
{
    public class DependencyAnalysisHistoryListDto
    {
        public Guid RunId { get; set; }
        public string RepoUrl { get; set; } = "";
        public DateTime AnalyzedAt { get; set; }

        public int TotalPackages { get; set; }
        public int OutdatedPackages { get; set; }
        public int VulnerablePackages { get; set; }
        public int RiskScore { get; set; }
    }

    public class DependencyAnalysisHistoryDetailsDto
    {
        public Guid RunId { get; set; }
        public string RepoUrl { get; set; } = "";
        public DateTime AnalyzedAt { get; set; }

        public int TotalPackages { get; set; }
        public int OutdatedPackages { get; set; }
        public int VulnerablePackages { get; set; }
        public int RiskScore { get; set; }

        public DependencyAnalysisResultDto Result { get; set; } = new();
    }
}
