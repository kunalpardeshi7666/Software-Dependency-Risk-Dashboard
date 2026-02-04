using Microsoft.EntityFrameworkCore;
using SDMBackend.Models;

namespace SDMBackend.DAL
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Developer> Developers { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<TaskEntity> Tasks { get; set; }
        public DbSet<Dependency> Dependencies { get; set; }
        public DbSet<Technology> Technologies { get; set; }
        public DbSet<ModuleTechnology> ModuleTechnologies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Composite Key for ModuleTechnology
            modelBuilder.Entity<ModuleTechnology>()
                .HasKey(mt => new { mt.ModuleID, mt.TechID });

            // Unique Email for User
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // 1:1 relationship User <-> Developer
            modelBuilder.Entity<User>()
                .HasOne(u => u.Developer)
                .WithOne(d => d.User)
                .HasForeignKey<Developer>(d => d.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ Seed default Admin user (STATIC hash)
            // Precompute this hash once using BCrypt.Net.BCrypt.HashPassword("Admin@123")
            modelBuilder.Entity<User>().HasData(
               new User
               {
                   UserID = 1,
                   Name = "Admin",
                   Email = "admin@example.com",
                   PasswordHash = "$2a$11$7BXuhF1wT/3BpmG1/UqukOlcW7XXuP7NygInXoqq1UENtHikRgCNK", // Example hash, replace with your own
                   Role = "Admin"
               }
           );
        }
    }
}
