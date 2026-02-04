namespace DependencySystem.API.DTOs
{
    public class ScanRunSummaryDto
    {
        public Guid ScanRunId { get; set; }
        public Guid ProjectId { get; set; }
        public string ScanType { get; set; } = "";
        public DateTime ScanAt { get; set; }

        public int TotalPackages { get; set; }
        public int OutdatedPackages { get; set; }
        public int VulnerablePackages { get; set; }
        public int CircularDependencies { get; set; }

        public int RiskScore { get; set; }
    }

}
