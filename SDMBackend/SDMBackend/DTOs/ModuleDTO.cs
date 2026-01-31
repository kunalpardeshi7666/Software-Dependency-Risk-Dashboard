namespace SDMBackend.DTOs
{
    public class ModuleDTO
    {
        public int ModuleID { get; set; }
        public string ModuleName { get; set; } = null!;
        public string Version { get; set; } = null!;
        public int ProjectID { get; set; }
    }
}
