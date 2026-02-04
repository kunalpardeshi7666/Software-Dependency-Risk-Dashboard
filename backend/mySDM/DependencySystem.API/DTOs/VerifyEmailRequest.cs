namespace DependencySystem.API.DTOs.Auth
{
    public class VerifyEmailRequest
    {
        public string Email { get; set; } = null;
        public string Otp { get; set; } =null;
    }
}
