using System.ComponentModel.DataAnnotations;

namespace SDMBackend.DTOs
{
    public class RegisterDeveloperDTO
    {
        [Required]
        public string Name { get; set; } = null!;

        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;

        public int Experience { get; set; } = 0; // default 0
    }
}
