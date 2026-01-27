using System.ComponentModel.DataAnnotations;

public class Developer
{
    [Key]
    public int DeveloperID { get; set; }

    public string DeveloperName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
    public int Experience { get; set; }
}
