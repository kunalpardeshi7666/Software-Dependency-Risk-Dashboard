namespace SDMBackend.DTOs
{
    public class DependencyDTO
    {
        public int DependencyID { get; set; }
        public int ModuleID { get; set; }
        public int DependsOnModuleID { get; set; }
    }
}
