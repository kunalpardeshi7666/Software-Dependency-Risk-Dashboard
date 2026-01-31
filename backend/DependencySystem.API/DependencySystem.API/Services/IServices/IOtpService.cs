
    public interface IOtpService
    {
        Task<string> GenerateOtpAsync(
            string email,
            string purpose,
            string? ipAddress,
            string? userAgent,
            string? mobileNumber = null);

        Task<bool> ValidateOtpAsync(
            string email,
            string otp,
            string purpose);
    }
