using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SDMBackend.Models
{
    [Table("Modules")]
    public class Module
    {
        [Key]
        public int ModuleID { get; set; }
        public string ModuleName { get; set; } = null!;
        public string Version { get; set; } = null!;
        public int ProjectID { get; set; }
        public Project? Project { get; set; }

        public ICollection<ModuleTechnology> ModuleTechnologies { get; set; } = new List<ModuleTechnology>();
        public ICollection<TaskEntity> Tasks { get; set; } = new List<TaskEntity>();
        public ICollection<Dependency> Dependencies { get; set; } = new List<Dependency>();
    }

}
