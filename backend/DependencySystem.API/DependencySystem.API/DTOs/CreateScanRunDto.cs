namespace DependencySystem.API.DTOs
{
    public class CreateScanRunDto
    {
        public Guid ProjectId { get; set; }
        public string ScanType { get; set; } = "NPM";

        public List<PackageItemDto> Packages { get; set; } = new();
        public List<GraphEdgeDto> Edges { get; set; } = new();
    }

    public class PackageItemDto
    {
        public string Name { get; set; } = "";
        public string CurrentVersion { get; set; } = "";
        public string? LatestVersion { get; set; }

        public bool IsOutdated { get; set; }
        public bool IsVulnerable { get; set; }
        public string Severity { get; set; } = "Low";
        public string? VulnerabilityId { get; set; }
    }

    public class GraphEdgeDto
    {
        public string From { get; set; } = "";
        public string To { get; set; } = "";
        public bool IsCircular { get; set; }
    }

}
