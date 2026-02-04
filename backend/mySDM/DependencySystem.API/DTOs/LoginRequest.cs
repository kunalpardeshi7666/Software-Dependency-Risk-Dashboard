

using System.ComponentModel.DataAnnotations;

namespace DependencySystem.API.DTOs.Auth
{
    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

}
