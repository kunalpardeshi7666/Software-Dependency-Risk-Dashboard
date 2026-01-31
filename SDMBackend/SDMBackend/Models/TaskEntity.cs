using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SDMBackend.Models
{
    [Table("tasks")]
    public class TaskEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TaskID { get; set; }

        [Required]
        [Column(TypeName = "varchar(150)")]
        public string TaskName { get; set; } = null!;

        [Required]
        [Column(TypeName = "varchar(50)")]
        public string Status { get; set; } = null!;

        [Required]
        [Column(TypeName = "varchar(50)")]
        public string Priority { get; set; } = null!;

        [Required]
        public int ModuleID { get; set; }

        [ForeignKey(nameof(ModuleID))]
        public Module? Module { get; set; }

        [Required]
        public int DeveloperID { get; set; }

        [ForeignKey(nameof(DeveloperID))]
        public Developer? Developer { get; set; }
    }
}
