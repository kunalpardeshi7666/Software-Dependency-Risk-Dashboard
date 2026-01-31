using DependencySystem.API.Models;

public class ModuleTechnology
{
    public int ModuleID { get; set; }
    public Module? Module { get; set; }

    public int TechID { get; set; }
    public Technology? Technology { get; set; }


}
