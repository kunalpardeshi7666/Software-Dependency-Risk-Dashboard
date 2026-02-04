using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Dependency")]
public class Dependency
{
    [Key]
    public int DependencyID { get; set; }

    public int ModuleID { get; set; }
    public Module? Module { get; set; }

    public int DependsOnModuleID { get; set; }
    public int SourceModuleID { get; set; }
    public Module? SourceModule { get; set; }
    public int TargetModuleID { get; set; }
    public Module? TargetModule { get; set; }


      


 



    //correct pattern
    //public int DependencyID { get; set; }

    //public int SourceModuleID { get; set; }
    //public Module SourceModule { get; set; } = null!;

    //public int TargetModuleID { get; set; }
    //public Module TargetModule { get; set; } = null!;

    //public DependencyType Type { get; set; }
}
