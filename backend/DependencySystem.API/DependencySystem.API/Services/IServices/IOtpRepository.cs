
    public interface IOtpRepository
    {
        Task SaveAsync(OtpVerification otp);

        Task<OtpVerification?> GetValidOtpAsync(
            string email,
            string otp,
            string purpose);

        Task InvalidateAsync(OtpVerification otp);

        Task InvalidateAllAsync(
            string email,
            string purpose);

        Task<int> CountRecentOtpsAsync(
            string email,
            string purpose,
            DateTime since);

        Task<DateTime?> GetLastOtpTimeAsync(
            string email,
            string purpose);
    }

