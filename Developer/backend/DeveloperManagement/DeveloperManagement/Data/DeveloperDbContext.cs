using Microsoft.EntityFrameworkCore;

namespace DeveloperManagement.Data
{
    public class DeveloperContext : DbContext
    {
        public DeveloperContext(DbContextOptions<DeveloperContext> options)
            : base(options) { }

        public DbSet<DeveloperManagement.Models.Developer> Developers { get; set; }
    }
}
