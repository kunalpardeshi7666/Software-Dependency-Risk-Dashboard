using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Project> Projects { get; set; }
    public DbSet<Module> Modules { get; set; }
    public DbSet<Dependency> Dependencies { get; set; }
    public DbSet<TaskEntity> Tasks { get; set; }
    public DbSet<Technology> Technologies { get; set; }
    public DbSet<Developer> Developers { get; set; }
    public DbSet<ModuleTechnology> ModuleTechnologies { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Composite Key for ModuleTechnology
        modelBuilder.Entity<ModuleTechnology>()
            .HasKey(mt => new { mt.ModuleID, mt.TechID });

        modelBuilder.Entity<ModuleTechnology>()
            .HasOne(mt => mt.Module)
            .WithMany(m => m.ModuleTechnologies)
            .HasForeignKey(mt => mt.ModuleID);

        modelBuilder.Entity<ModuleTechnology>()
            .HasOne(mt => mt.Technology)
            .WithMany(t => t.ModuleTechnologies)
            .HasForeignKey(mt => mt.TechID);
    }
}
