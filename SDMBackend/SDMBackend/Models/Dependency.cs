using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SDMBackend.Models
{
    [Table("dependencies")]
    public class Dependency
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DependencyID { get; set; }

        [Required]
        public int ModuleID { get; set; }

        [ForeignKey(nameof(ModuleID))]
        public Module? Module { get; set; }

        [Required]
        public int DependsOnModuleID { get; set; }
    }
}
