namespace SDMBackend.DTOs
{
    public class TaskDTO
    {
        public int TaskID { get; set; }
        public string TaskName { get; set; } = null!;
        public string Status { get; set; } = null!;
        public string Priority { get; set; } = null!;
        public int ModuleID { get; set; }
        public int DeveloperID { get; set; }
    }
}
