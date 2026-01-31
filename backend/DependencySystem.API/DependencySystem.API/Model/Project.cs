using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Project")]
public class Project
{
    [Key]
    public int ProjectID { get; set; }

    public string ProjectName { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Status { get; set; } = null!;

    public ICollection<Module> Modules { get; set; } = new List<Module>();
}
