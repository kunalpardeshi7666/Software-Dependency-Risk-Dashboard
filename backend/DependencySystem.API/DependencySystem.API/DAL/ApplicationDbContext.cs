using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using DependencySystem.API.Models;
using DependencySystem.API.Model;

namespace DependencySystem.API.DAL
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<OtpVerification> OtpVerifications { get; set; }   // ✅ ADD THIS

        public DbSet<Project> Projects { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<Dependency> Dependencies { get; set; }
        public DbSet<TaskEntity> Tasks { get; set; }
        public DbSet<Technology> Technologies { get; set; }
        public DbSet<Developer> Developers { get; set; }
        public DbSet<ModuleTechnology> ModuleTechnologies { get; set; }

        public DbSet<ProjectManager> ProjectManagers { get; set; }
        public DbSet<ProjectStakeholder> ProjectStakeholders { get; set; }
        public DbSet<ModuleReviewer> ModuleReviewers { get; set; }
        public DbSet<TaskDependency> TaskDependencies { get; set; }
        public DbSet<DeveloperTechnology> DeveloperTechnologies { get; set; }
        public DbSet<ProjectTechnology> ProjectTechnologies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ModuleTechnology>()
                .HasKey(mt => new { mt.ModuleID, mt.TechID });

            modelBuilder.Entity<ProjectManager>()
                .HasKey(pm => new { pm.ProjectID, pm.UserID });

            modelBuilder.Entity<ProjectStakeholder>()
                .HasKey(ps => new { ps.ProjectID, ps.UserID });

            modelBuilder.Entity<ModuleReviewer>()
                .HasKey(mr => new { mr.ModuleID, mr.DeveloperID });

            modelBuilder.Entity<TaskDependency>()
                .HasKey(td => new { td.TaskID, td.DependsOnTaskID });

            modelBuilder.Entity<DeveloperTechnology>()
                .HasKey(dt => new { dt.DeveloperID, dt.TechID });

            modelBuilder.Entity<ProjectTechnology>()
                .HasKey(pt => new { pt.ProjectID, pt.TechID });

            modelBuilder.Entity<TaskEntity>().ToTable("Tasks");

            // ✅ RefreshToken relationship
            modelBuilder.Entity<RefreshToken>()
                .HasOne(x => x.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Technology>().HasData(
                new Technology { TechID = 1, Name = "C#", Version = "12.0", Category = "Backend" },
                new Technology { TechID = 2, Name = "ASP.NET Core", Version = "8.0", Category = "Backend" },
                new Technology { TechID = 3, Name = "Entity Framework", Version = "8.0", Category = "ORM" }
            );
        }
    }
}
