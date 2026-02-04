using DependencySystem.API.Models;
using System.ComponentModel.DataAnnotations;

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

    public ICollection<TaskDependency> DependsOnTasks { get; set; } = new List<TaskDependency>();
    public ICollection<TaskDependency> DependentTasks { get; set; } = new List<TaskDependency>();
}
