using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DependencySystem.API.Models
{
    public class Technology
    {
        [Key]
        public int TechnologyID { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Version { get; set; }

        [MaxLength(50)]
        public string? Category { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        // Navigation properties
        public virtual ICollection<ModuleTechnology> ModuleTechnologies { get; set; } = new List<ModuleTechnology>();
        public virtual ICollection<DeveloperTechnology> DeveloperTechnologies { get; set; } = new List<DeveloperTechnology>();
        public virtual ICollection<ProjectTechnology> ProjectTechnologies { get; set; } = new List<ProjectTechnology>();

        //refer
        //public int TechnologyID { get; set; }

        //public string Name { get; set; } = string.Empty;

        //public ICollection<ModuleTechnology> ModuleTechnologies { get; set; }
        //    = new List<ModuleTechnology>();
    }
}