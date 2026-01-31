namespace DependencySystem.API.DTOs
{
    
    public class DependencyGraphDto
    {
        public List<GraphNodeDto> Nodes { get; set; } = new();
        public List<GraphEdgeViewDto> Edges { get; set; } = new();

        public List<PackageItemDto> Packages { get; set; } = new(); // ✅ add this
    }

    
  
}
