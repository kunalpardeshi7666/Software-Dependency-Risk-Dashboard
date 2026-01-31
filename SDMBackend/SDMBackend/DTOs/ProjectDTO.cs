namespace SDMBackend.DTOs
{
    public class ProjectDTO
    {
        public int ProjectID { get; set; }
        public string ProjectName { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Status { get; set; } = null!; // e.g., "Not Started", "In Progress", "Completed"
    }
}
