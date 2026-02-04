using System.ComponentModel.DataAnnotations;

namespace DependencySystem.API.DTOs.Admin
{
    public class SetUserActiveRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        public bool IsActive { get; set; }
    }
}
