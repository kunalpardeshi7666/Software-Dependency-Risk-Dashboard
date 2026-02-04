using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SDMBackend.Models
{
    [Table("Dependencies")]
    public class Dependency
    {
        [Key]
        public int DependencyID { get; set; }
        public int ModuleID { get; set; }
        public Module? Module { get; set; }
        public int DependsOnModuleID { get; set; }
    }

}
