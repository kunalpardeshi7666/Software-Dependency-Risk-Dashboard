public class AuthResponse
{
    public string UserId { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Role { get; set; }   // ✅ ADD THIS
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
}
