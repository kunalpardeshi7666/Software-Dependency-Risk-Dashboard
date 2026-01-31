namespace DependencySystem.API.DTOs.projects
{
    public class ProjectCreateDto
    {
        public string ProjectName { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Status { get; set; } = null!;
    }

}
