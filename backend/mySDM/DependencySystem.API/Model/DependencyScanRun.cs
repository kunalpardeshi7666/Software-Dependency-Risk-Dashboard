using DependencySystem.API.Models;

namespace DependencySystem.API.Model
{
    public class DependencyScanRun
    {
        public Guid ScanRunId { get; set; }
        public Guid ProjectId { get; set; }

        public string ScanType { get; set; } = "SBOM"; // SBOM / NPM / DOTNET
        public DateTime ScanAt { get; set; } = DateTime.UtcNow;

        public int TotalPackages { get; set; }
        public int OutdatedPackages { get; set; }
        public int VulnerablePackages { get; set; }
        public int CircularDependencies { get; set; }

        public int RiskScore { get; set; } // 0-100

        public string CreatedByUserId { get; set; } = "";

        public List<DependencyPackageItem> Packages { get; set; } = new();
        public List<DependencyGraphEdge> Edges { get; set; } = new();
    }

}
