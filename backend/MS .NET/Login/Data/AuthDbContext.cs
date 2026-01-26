using Login.Model;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data;

namespace Login.Data
{
    public class AuthDbContext : DbContext
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        //public DbSet<Role> Roles { get; set; }
        //public DbSet<RefreshToken> RefreshTokens { get; set; }
    }
}
