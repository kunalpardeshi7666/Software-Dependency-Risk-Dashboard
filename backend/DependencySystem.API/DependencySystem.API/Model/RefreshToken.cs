using DependencySystem.API.Model;
using DependencySystem.API.Models;

public class RefreshToken
{
    public int Id { get; set; }
    public string Token { get; set; } = null!;
    public string UserId { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; } = false;

    public ApplicationUser User { get; set; } = null!;
}
