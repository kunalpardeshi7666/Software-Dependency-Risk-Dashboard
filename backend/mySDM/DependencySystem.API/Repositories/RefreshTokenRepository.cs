using DependencySystem.API.DAL;
using DependencySystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DependencySystem.API.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly ApplicationDbContext _db;

        public RefreshTokenRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task SaveAsync(string userId, string refreshToken)
        {
            _db.RefreshTokens.Add(new RefreshToken
            {
                UserId = userId,
                Token = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });

            await _db.SaveChangesAsync();
        }

        public async Task<RefreshToken?> GetAsync(string refreshToken)
        {
            return await _db.RefreshTokens
                .FirstOrDefaultAsync(x =>
                    x.Token == refreshToken &&
                    !x.IsRevoked &&
                    x.ExpiresAt > DateTime.UtcNow);
        }

        public async Task RotateAsync(RefreshToken oldToken, string newToken)
        {
            oldToken.IsRevoked = true;

            _db.RefreshTokens.Add(new RefreshToken
            {
                UserId = oldToken.UserId,
                Token = newToken,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });

            await _db.SaveChangesAsync();
        }

        public async Task RevokeAllAsync(string userId)
        {
            var tokens = await _db.RefreshTokens
                .Where(x => x.UserId == userId && !x.IsRevoked)
                .ToListAsync();

            foreach (var token in tokens)
                token.IsRevoked = true;

            await _db.SaveChangesAsync();
        }
    }
}
