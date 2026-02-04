namespace DependencySystem.API.Model
{
    public class DependencyPackageItem
    {
        public Guid Id { get; set; }
        public Guid ScanRunId { get; set; }

        public string Name { get; set; } = "";
        public string CurrentVersion { get; set; } = "";
        public string? LatestVersion { get; set; }

        public bool IsOutdated { get; set; }
        public bool IsVulnerable { get; set; }

        public string Severity { get; set; } = "Low"; // Low/Medium/High/Critical
        public string? VulnerabilityId { get; set; } // CVE or GHSA
    }

}
