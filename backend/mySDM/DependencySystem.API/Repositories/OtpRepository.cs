using DependencySystem.API.DAL;
using DependencySystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DependencySystem.API.Repositories
{
    public class OtpRepository : IOtpRepository
    {
        private readonly ApplicationDbContext _db;

        public OtpRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task SaveAsync(OtpVerification otp)
        {
            _db.OtpVerifications.Add(otp);
            await _db.SaveChangesAsync();
        }

        public async Task<OtpVerification?> GetValidOtpAsync(string email, string otp, string purpose)
        {
            return await _db.OtpVerifications
                .FirstOrDefaultAsync(x =>
                    x.Email == email &&
                    x.Otp == otp &&
                    x.Purpose == purpose &&
                    !x.IsUsed &&
                    x.ExpiresAt > DateTime.UtcNow);
        }

        public async Task InvalidateAsync(OtpVerification otp)
        {
            otp.IsUsed = true;
            await _db.SaveChangesAsync();
        }

        public async Task InvalidateAllAsync(string email, string purpose)
        {
            var list = await _db.OtpVerifications
                .Where(x => x.Email == email && x.Purpose == purpose && !x.IsUsed)
                .ToListAsync();

            foreach (var item in list)
                item.IsUsed = true;

            await _db.SaveChangesAsync();
        }

        public async Task<int> CountRecentOtpsAsync(string email, string purpose, DateTime since)
        {
            return await _db.OtpVerifications
                .CountAsync(x => x.Email == email && x.Purpose == purpose && x.CreatedAt >= since);
        }

        public async Task<DateTime?> GetLastOtpTimeAsync(string email, string purpose)
        {
            return await _db.OtpVerifications
                .Where(x => x.Email == email && x.Purpose == purpose)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => (DateTime?)x.CreatedAt)
                .FirstOrDefaultAsync();
        }
    }
}
