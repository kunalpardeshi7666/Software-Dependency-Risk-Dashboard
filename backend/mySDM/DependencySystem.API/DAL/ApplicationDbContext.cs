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

        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<OtpVerification> OtpVerifications => Set<OtpVerification>();

        public DbSet<Project> Projects => Set<Project>();
        public DbSet<Module> Modules => Set<Module>();
        public DbSet<Dependency> Dependencies => Set<Dependency>();
        public DbSet<TaskEntity> Tasks => Set<TaskEntity>();
        public DbSet<Technology> Technologies => Set<Technology>();
        public DbSet<Developer> Developers => Set<Developer>();

        public DbSet<ProjectManager> ProjectManagers => Set<ProjectManager>();
        public DbSet<ProjectStakeholder> ProjectStakeholders => Set<ProjectStakeholder>();
        public DbSet<ProjectTeamMember> ProjectTeamMembers => Set<ProjectTeamMember>();

        public DbSet<ModuleTechnology> ModuleTechnologies => Set<ModuleTechnology>();
        public DbSet<ProjectTechnology> ProjectTechnologies => Set<ProjectTechnology>();
        public DbSet<DeveloperTechnology> DeveloperTechnologies => Set<DeveloperTechnology>();
        public DbSet<ModuleReviewer> ModuleReviewers => Set<ModuleReviewer>();

        public DbSet<TaskDependency> TaskDependencies => Set<TaskDependency>();
        public DbSet<TeamMemberProfile> TeamMemberProfiles => Set<TeamMemberProfile>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            /* -------------------- Project -------------------- */

            modelBuilder.Entity<Project>()
                .HasIndex(p => p.ProjectName)
                .IsUnique();

            /* -------------------- Module -------------------- */

            modelBuilder.Entity<Module>()
                .HasIndex(m => m.ProjectID);

            modelBuilder.Entity<Module>()
                .HasOne(m => m.Project)
                .WithMany(p => p.Modules)
                .HasForeignKey(m => m.ProjectID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Module>()
                .Property(m => m.Status)
                .HasConversion<string>();

            /* -------------------- Task -------------------- */

            modelBuilder.Entity<TaskEntity>()
                .ToTable("Tasks");

            modelBuilder.Entity<TaskEntity>()
                .HasIndex(t => t.ModuleID);

            /* -------------------- Task Dependency (self-referencing) -------------------- */

            modelBuilder.Entity<TaskDependency>()
                .HasKey(td => new { td.TaskID, td.DependsOnTaskID });

            modelBuilder.Entity<TaskDependency>()
                .HasOne(td => td.Task)
                .WithMany(t => t.DependsOnTasks)
                .HasForeignKey(td => td.TaskID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TaskDependency>()
                .HasOne(td => td.DependsOnTask)
                .WithMany(t => t.DependentTasks)
                .HasForeignKey(td => td.DependsOnTaskID)
                .OnDelete(DeleteBehavior.Restrict);

            /* -------------------- Module ↔ Technology -------------------- */

            modelBuilder.Entity<ModuleTechnology>()
                .HasKey(mt => new { mt.ModuleID, mt.TechnologyID });

            modelBuilder.Entity<ModuleTechnology>()
                .HasOne(mt => mt.Module)
                .WithMany(m => m.ModuleTechnologies)
                .HasForeignKey(mt => mt.ModuleID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ModuleTechnology>()
                .HasOne(mt => mt.Technology)
                .WithMany(t => t.ModuleTechnologies)
                .HasForeignKey(mt => mt.TechnologyID)
                .OnDelete(DeleteBehavior.Restrict);

            /* -------------------- Project ↔ Technology -------------------- */

            modelBuilder.Entity<ProjectTechnology>()
                .HasKey(pt => new { pt.ProjectID, pt.TechnologyID });

            /* -------------------- Developer ↔ Technology -------------------- */

            modelBuilder.Entity<DeveloperTechnology>()
                .HasKey(dt => new { dt.DeveloperID, dt.TechnologyID });

            /* -------------------- Project Manager -------------------- */

            modelBuilder.Entity<ProjectManager>()
                .HasKey(pm => new { pm.ProjectID, pm.UserID });

            modelBuilder.Entity<ProjectManager>()
                .HasOne(pm => pm.Project)
                .WithMany(p => p.ProjectManagers)
                .HasForeignKey(pm => pm.ProjectID);

            modelBuilder.Entity<ProjectManager>()
    .HasOne(pm => pm.User)
    .WithMany(u => u.ProjectManagers)
    .HasForeignKey(pm => pm.UserID);


            /* -------------------- Project Stakeholder -------------------- */

            modelBuilder.Entity<ProjectStakeholder>()
                .HasKey(ps => new { ps.ProjectID, ps.UserID });

            /* -------------------- Project Team Member -------------------- */

            modelBuilder.Entity<ProjectTeamMember>()
                .HasKey(ptm => new { ptm.ProjectID, ptm.UserID });

            modelBuilder.Entity<ProjectTeamMember>()
                .HasOne(ptm => ptm.Project)
                .WithMany(p => p.ProjectTeamMembers)
                .HasForeignKey(ptm => ptm.ProjectID);

            modelBuilder.Entity<ProjectTeamMember>()
                .HasOne(ptm => ptm.User)
                .WithMany(u => u.ProjectTeamMembers)
                .HasForeignKey(ptm => ptm.UserID);

            /* -------------------- Module Reviewer -------------------- */

            modelBuilder.Entity<ModuleReviewer>()
                .HasKey(mr => new { mr.ModuleID, mr.DeveloperID });

            /* -------------------- Dependency (Module ↔ Module) -------------------- */

            modelBuilder.Entity<Dependency>()
                .HasOne(d => d.SourceModule)
                .WithMany()
                .HasForeignKey(d => d.SourceModuleID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Dependency>()
                .HasOne(d => d.TargetModule)
                .WithMany()
                .HasForeignKey(d => d.TargetModuleID)
                .OnDelete(DeleteBehavior.Restrict);

            /* -------------------- TeamMemberProfile (1–1) -------------------- */

            modelBuilder.Entity<TeamMemberProfile>()
                .HasIndex(p => p.UserID)
                .IsUnique();

            modelBuilder.Entity<TeamMemberProfile>()
                .HasOne(p => p.User)
                .WithOne(u => u.TeamMemberProfile)
                .HasForeignKey<TeamMemberProfile>(p => p.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            /* -------------------- Refresh Token -------------------- */

            modelBuilder.Entity<RefreshToken>()
                .HasOne(rt => rt.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            /* -------------------- OTP -------------------- */

            modelBuilder.Entity<OtpVerification>()
                .HasIndex(o => o.Email)
                .IsUnique();

            /* -------------------- Seed Data -------------------- */

            modelBuilder.Entity<Technology>().HasData(
                new Technology { TechnologyID = 1, Name = "C#", Version = "12.0", Category = "Backend" },
                new Technology { TechnologyID = 2, Name = "ASP.NET Core", Version = "8.0", Category = "Backend" },
                new Technology { TechnologyID = 3, Name = "Entity Framework", Version = "8.0", Category = "ORM" }
            );
        }
    }
}
