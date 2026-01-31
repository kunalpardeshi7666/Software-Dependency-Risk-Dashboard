using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SDMBackend.Models
{
    [Table("modules")]
    public class Module
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ModuleID { get; set; }

        [Required]
        [Column(TypeName = "varchar(150)")]
        public string ModuleName { get; set; } = null!;

        [Required]
        [Column(TypeName = "varchar(50)")]
        public string Version { get; set; } = null!;

        [Required]
        public int ProjectID { get; set; }

        [ForeignKey(nameof(ProjectID))]
        public Project? Project { get; set; }

        public ICollection<ModuleTechnology> ModuleTechnologies { get; set; }
            = new List<ModuleTechnology>();

        public ICollection<TaskEntity> Tasks { get; set; }
            = new List<TaskEntity>();

        public ICollection<Dependency> Dependencies { get; set; }
            = new List<Dependency>();
    }
}
