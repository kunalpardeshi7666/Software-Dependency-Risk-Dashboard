namespace DependencySystem.API.DTOs
{
    public class GraphEdgeViewDto
    {
        public string From { get; set; } = "";
        public string To { get; set; } = "";
        public bool IsCircular { get; set; }
    }

}
