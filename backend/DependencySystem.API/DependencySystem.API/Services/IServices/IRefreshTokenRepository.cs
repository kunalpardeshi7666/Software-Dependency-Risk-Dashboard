
    public interface IRefreshTokenRepository
    {
        Task SaveAsync(string userId, string refreshToken);
        Task<RefreshToken?> GetAsync(string refreshToken);
        Task RotateAsync(RefreshToken oldToken, string newToken);
        Task RevokeAllAsync(string userId);
    }
