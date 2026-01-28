using System.ComponentModel.DataAnnotations;

namespace DeveloperManagement.Models
{
    public class Developer
    {
        [Key]
        public int DeveloperID { get; set; }

        [Required]
        public string DeveloperName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string Role { get; set; }
        public int Experience { get; set; }
    }
}
