namespace DependencySystem.API.DTOs
{
    public class GraphNodeDto
    {
        public string Id { get; set; } = "";
        public string Label { get; set; } = "";

        public string RiskLevel { get; set; } = "Low"; // Low/Medium/High/Critical

        public bool IsOutdated { get; set; }  // ✅ required for filter
        public bool IsVulnerable { get; set; } // ✅ required for filter
    }


}
