namespace DependencySystem.API.DTOs.projects
{
    public class ProjectReadDto
    {
        public int ProjectID { get; set; }
        public string ProjectName { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Status { get; set; } = null!;
    }

}
