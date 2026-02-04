using System.ComponentModel.DataAnnotations;

namespace DependencySystem.API.DTOs.Admin
{
    public class AdminRegisterRequest
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string MobileNumber { get; set; } = string.Empty;

        [Required, MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = "Developer";

        // ✅ Admin can set Active/Inactive
        public bool IsActive { get; set; } = true;
    }
}
