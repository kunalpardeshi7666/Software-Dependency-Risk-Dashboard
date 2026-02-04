using DependencySystem.API.DTOs.Auth;

public interface IAuthService
{
    Task RegisterAsync(string email, string MobileNumber, string password, string fullName, string role);


    Task VerifyEmailAsync(string email, string otp);

    Task<AuthResponse> LoginAsync(string email, string password);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken);

    Task LogoutAsync(string userId);

    Task ForgotPasswordAsync(string email);
    Task ResetPasswordAsync(string email, string otp, string newPassword);
    Task ChangePasswordAsync(string userId, ChangePasswordRequest request);
}
