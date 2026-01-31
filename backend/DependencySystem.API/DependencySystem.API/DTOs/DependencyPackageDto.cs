namespace DependencySystem.API.DTOs
{
    public class DependencyPackageDto
    {
        public string Name { get; set; } = "";
        public string CurrentVersion { get; set; } = "";
        public string? LatestVersion { get; set; }

        public bool IsOutdated { get; set; }
        public bool IsVulnerable { get; set; }

        public string Severity { get; set; } = "Low"; // Low/Medium/High/Critical
        public string? AdvisoryId { get; set; } // CVE / GHSA
    }
}
