namespace TaskManagementApi.DTOs
{
    public class TaskDTO
    {
        public int TaskID { get; set; }
        public string TaskName { get; set; }
        public string Status { get; set; }
        public string Priority { get; set; }
        public int ModuleID { get; set; }
        public int DeveloperID { get; set; }
    }
}
