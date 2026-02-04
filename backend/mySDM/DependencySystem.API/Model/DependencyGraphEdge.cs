namespace DependencySystem.API.Models
{
    public class DependencyGraphEdge
    {
        public Guid Id { get; set; }
        public Guid ScanRunId { get; set; }

        public string From { get; set; } = "";
        public string To { get; set; } = "";

        public bool IsCircular { get; set; }
    }

}
