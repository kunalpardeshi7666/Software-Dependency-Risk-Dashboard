using DependencySystem.API.Model.module.enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Module")]
public class Module
{

    [Key]
    public int ModuleID { get; set; }

    public string ModuleName { get; set; } = null!;
    public string Version { get; set; } = "1.0.0";

    public int ProjectID { get; set; }

    [ForeignKey("ProjectID")]
    public Project? Project { get; set; }
    [StringLength(1000)]
    public string? Description { get; set; }

    [Required]
    public ModuleStatus Status { get; set; } = ModuleStatus.Pending;

    public ICollection<ModuleTechnology> ModuleTechnologies { get; set; }
        = new List<ModuleTechnology>();

    public ICollection<TaskEntity> Tasks { get; set; }
        = new List<TaskEntity>();

}
