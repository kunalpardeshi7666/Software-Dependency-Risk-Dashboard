using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Module")]
public class Module
{
    [Key]
    public int ModuleID { get; set; }

    public string ModuleName { get; set; } = null!;
    public string Version { get; set; } = null!;

    public int ProjectID { get; set; }
    public Project Project { get; set; } = null!;

    public ICollection<ModuleTechnology> ModuleTechnologies { get; set; }
        = new List<ModuleTechnology>();
}
