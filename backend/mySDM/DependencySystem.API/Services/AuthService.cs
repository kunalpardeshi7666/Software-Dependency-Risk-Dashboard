using DependencySystem.API.DTOs.Auth;
using DependencySystem.API.Model;
using Microsoft.AspNetCore.Identity;

namespace DependencySystem.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IOtpService _otpService;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IRefreshTokenRepository _refreshRepo;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IOtpService otpService,
            IJwtTokenService jwtTokenService,
            IRefreshTokenRepository refreshRepo)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _otpService = otpService;
            _jwtTokenService = jwtTokenService;
            _refreshRepo = refreshRepo;
        }

        // =====================================================
        // REGISTER
        // =====================================================
        public async Task RegisterAsync(string email, string mobileNumber, string password, string fullName, string role)
        {
            try
            {
                // ✅ Basic validations
                if (string.IsNullOrWhiteSpace(email))
                    throw new Exception("Email is required");

                if (string.IsNullOrWhiteSpace(mobileNumber))
                    throw new Exception("MobileNumber is required");

                if (string.IsNullOrWhiteSpace(password))
                    throw new Exception("Password is required");

                if (string.IsNullOrWhiteSpace(fullName))
                    throw new Exception("FullName is required");

                // ✅ Check existing user
                var existingUser = await _userManager.FindByEmailAsync(email);
                if (existingUser != null)
                    throw new Exception("User already exists");

                // ✅ Split FullName to FirstName / LastName
                var firstName = fullName.Trim();
                var lastName = "";

                if (fullName.Contains(" "))
                {
                    var parts = fullName.Trim().Split(" ", StringSplitOptions.RemoveEmptyEntries);
                    firstName = parts[0];
                    lastName = string.Join(" ", parts.Skip(1));
                }

                var user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    PhoneNumber = mobileNumber,
                    EmailConfirmed = false,
                    FirstName = firstName,
                    LastName = lastName
                };

                var result = await _userManager.CreateAsync(user, password);
                if (!result.Succeeded)
                    throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));

                // ✅ Role handling (only allow public roles)
                var allowedRoles = new[] { "Developer", "ReadOnly" };

                if (string.IsNullOrWhiteSpace(role))
                    role = "Developer";

                if (!allowedRoles.Contains(role))
                    throw new Exception("Invalid role. Allowed roles: Developer, ReadOnly");

                var roleResult = await _userManager.AddToRoleAsync(user, role);
                if (!roleResult.Succeeded)
                    throw new Exception(string.Join(", ", roleResult.Errors.Select(e => e.Description)));

                // ✅ Send OTP for email verification
                await _otpService.GenerateOtpAsync(email, "EMAIL_VERIFICATION", null, null, mobileNumber);
            }
            catch
            {
                // ✅ just rethrow, controller will return clean response
                throw;
            }
        }

        // =====================================================
        // VERIFY EMAIL (OTP)
        // =====================================================
        public async Task VerifyEmailAsync(string email, string otp)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(email))
                    throw new Exception("Email is required");

                if (string.IsNullOrWhiteSpace(otp))
                    throw new Exception("Otp is required");

                var valid = await _otpService.ValidateOtpAsync(email, otp, "EMAIL_VERIFICATION");
                if (!valid)
                    throw new Exception("Invalid or expired OTP");

                var user = await _userManager.FindByEmailAsync(email)
                    ?? throw new Exception("User not found");

                user.EmailConfirmed = true;

                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                    throw new Exception(string.Join(", ", updateResult.Errors.Select(e => e.Description)));
            }
            catch
            {
                throw;
            }
        }

        // =====================================================
        // LOGIN
        // =====================================================
        public async Task<AuthResponse> LoginAsync(string email, string password)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(email))
                    throw new Exception("Email is required");

                if (string.IsNullOrWhiteSpace(password))
                    throw new Exception("Password is required");

                var user = await _userManager.FindByEmailAsync(email)
                    ?? throw new Exception("Invalid credentials");

                if (!user.EmailConfirmed)
                    throw new Exception("Email not verified");

                if (!user.IsActive)
                    throw new Exception("Account is disabled. Contact Admin.");

                var result = await _signInManager.CheckPasswordSignInAsync(user, password, true);
                if (!result.Succeeded)
                    throw new Exception("Invalid credentials");

                user.LastLogin = DateTime.UtcNow;

                var update = await _userManager.UpdateAsync(user);
                if (!update.Succeeded)
                    throw new Exception(string.Join(", ", update.Errors.Select(e => e.Description)));

                var roles = await _userManager.GetRolesAsync(user);

                var accessToken = await _jwtTokenService.CreateAccessTokenAsync(user);
                var refreshToken = _jwtTokenService.CreateRefreshToken();

                await _refreshRepo.SaveAsync(user.Id, refreshToken);

                return new AuthResponse
                {
                    UserId = user.Id,
                    Email = user.Email!,
                    Role = roles.FirstOrDefault() ?? "Developer",
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                };
            }
            catch
            {
                throw;
            }
        }

        // =====================================================
        // REFRESH TOKEN
        // =====================================================
        public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(refreshToken))
                    throw new Exception("Refresh token is required");

                var oldToken = await _refreshRepo.GetAsync(refreshToken);
                if (oldToken == null)
                    throw new Exception("Invalid refresh token");

                var user = await _userManager.FindByIdAsync(oldToken.UserId)
                    ?? throw new Exception("User not found");

                if (!user.IsActive)
                    throw new Exception("Account is disabled. Contact Admin.");

                var roles = await _userManager.GetRolesAsync(user);

                var newAccessToken = await _jwtTokenService.CreateAccessTokenAsync(user);
                var newRefreshToken = _jwtTokenService.CreateRefreshToken();

                await _refreshRepo.RotateAsync(oldToken, newRefreshToken);

                return new AuthResponse
                {
                    UserId = user.Id,
                    Email = user.Email!,
                    Role = roles.FirstOrDefault() ?? "Developer",
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken
                };
            }
            catch
            {
                throw;
            }
        }

        // =====================================================
        // LOGOUT
        // =====================================================
        public async Task LogoutAsync(string userId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(userId))
                    throw new Exception("Invalid user");

                await _refreshRepo.RevokeAllAsync(userId);
            }
            catch
            {
                throw;
            }
        }

        // =====================================================
        // FORGOT PASSWORD
        // =====================================================
        public async Task ForgotPasswordAsync(string email)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(email))
                    return;

                var user = await _userManager.FindByEmailAsync(email);
                if (user == null) return;

                await _otpService.GenerateOtpAsync(email, "RESET_PASSWORD", null, null);
            }
            catch
            {
                throw;
            }
        }

        // =====================================================
        // RESET PASSWORD
        // =====================================================
        public async Task ResetPasswordAsync(string email, string otp, string newPassword)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(email))
                    throw new Exception("Email is required");

                if (string.IsNullOrWhiteSpace(otp))
                    throw new Exception("Otp is required");

                if (string.IsNullOrWhiteSpace(newPassword))
                    throw new Exception("NewPassword is required");

                var valid = await _otpService.ValidateOtpAsync(email, otp, "RESET_PASSWORD");
                if (!valid)
                    throw new Exception("Invalid or expired OTP");

                var user = await _userManager.FindByEmailAsync(email)
                    ?? throw new Exception("User not found");

                var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

                var result = await _userManager.ResetPasswordAsync(user, resetToken, newPassword);
                if (!result.Succeeded)
                    throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
            }
            catch
            {
                throw;
            }
        }

        // =====================================================
        // CHANGE PASSWORD
        // =====================================================
        public async Task ChangePasswordAsync(string userId, ChangePasswordRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(userId))
                    throw new Exception("Invalid user");

                if (request == null)
                    throw new Exception("Request body is empty");

                var user = await _userManager.FindByIdAsync(userId)
                    ?? throw new Exception("User not found");

                var result = await _userManager.ChangePasswordAsync(
                    user,
                    request.CurrentPassword,
                    request.NewPassword);

                if (!result.Succeeded)
                    throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
            }
            catch
            {
                throw;
            }
        }
    }
}
