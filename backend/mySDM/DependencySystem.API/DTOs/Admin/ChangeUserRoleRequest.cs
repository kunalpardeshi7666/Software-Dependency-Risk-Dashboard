using System.ComponentModel.DataAnnotations;

namespace DependencySystem.API.DTOs.Admin
{
    public class ChangeUserRoleRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string NewRole { get; set; } = string.Empty;
    }
}
