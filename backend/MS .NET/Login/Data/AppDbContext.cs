using Login.Model;
using Microsoft.EntityFrameworkCore;

namespace Login.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Otp> Otps => Set<Otp>();
        public DbSet<MagicLink> MagicLinks => Set<MagicLink>();


    }
}
