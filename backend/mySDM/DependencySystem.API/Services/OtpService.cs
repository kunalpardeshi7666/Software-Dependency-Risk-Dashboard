using System;
using System.Security.Cryptography;


public class OtpService : IOtpService
{
    private const int MAX_OTP_REQUESTS = 5;
    private static readonly TimeSpan RATE_LIMIT_WINDOW =
        TimeSpan.FromMinutes(15);

    private readonly IOtpRepository _otpRepository;
    private readonly IEmailService _emailService;


    public OtpService(
        IOtpRepository otpRepository,
        IEmailService emailService)
    {
        _otpRepository = otpRepository;
        _emailService = emailService;
    }

    // =====================================================
    // Generate OTP (Email / SMS)
    // =====================================================
    public async Task<string> GenerateOtpAsync(
        string email,
        string purpose,
        string? ipAddress,
        string? userAgent,
        string? mobileNumber = null)
    {
        // ⏱️ Resend cooldown (60 seconds)
        var lastOtpTime =
            await _otpRepository.GetLastOtpTimeAsync(email, purpose);

        if (lastOtpTime.HasValue &&
            DateTime.UtcNow.Subtract(lastOtpTime.Value).TotalSeconds < 60)
        {
            throw new Exception(
                "Please wait before requesting another OTP.");
        }

        // 🚫 Rate limiting (5 OTPs / 15 minutes)
        var since = DateTime.UtcNow.Subtract(RATE_LIMIT_WINDOW);

        var count = await _otpRepository
            .CountRecentOtpsAsync(email, purpose, since);

        if (count >= MAX_OTP_REQUESTS)
        {
            throw new Exception(
                "Too many OTP requests. Please try again later.");
        }

        // ❌ Invalidate old OTPs
        await _otpRepository.InvalidateAllAsync(email, purpose);

        var otp = GenerateSecureOtp();

        var otpEntity = new OtpVerification
        {
            Email = email,
            Otp = otp,
            Purpose = purpose,
            ExpiresAt = DateTime.UtcNow.AddMinutes(10),
            IsUsed = false,
            CreatedAt = DateTime.UtcNow,
            IpAddress = ipAddress,
            UserAgent = userAgent
        };

        await _otpRepository.SaveAsync(otpEntity);

        // 📧 Email OTP
        await _emailService.SendOtpAsync(email, otp);

      
        return otp;
    }

    // =====================================================
    // Validate OTP
    // =====================================================
    public async Task<bool> ValidateOtpAsync(
        string email,
        string otp,
        string purpose)
    {
        var record = await _otpRepository
            .GetValidOtpAsync(email, otp, purpose);

        if (record == null)
            return false;

        await _otpRepository.InvalidateAsync(record);
        return true;
    }

    // =====================================================
    // Secure OTP Generator (6 digits)
    // =====================================================
    private static string GenerateSecureOtp()
    {
        using var rng = RandomNumberGenerator.Create();
        var bytes = new byte[4];
        rng.GetBytes(bytes);

        var number = BitConverter.ToUInt32(bytes, 0) % 1_000_000;
        return number.ToString("D6");
    }
}
