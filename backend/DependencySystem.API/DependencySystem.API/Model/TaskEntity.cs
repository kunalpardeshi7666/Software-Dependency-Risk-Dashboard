using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Task")]
public class TaskEntity
{
    [Key]
    public int TaskID { get; set; }

    public string TaskName { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string Priority { get; set; } = null!;

    public int ModuleID { get; set; }
    public Module? Module { get; set; }

    public int DeveloperID { get; set; }
    public Developer? Developer { get; set; }
}
