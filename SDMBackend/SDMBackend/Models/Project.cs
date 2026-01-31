using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SDMBackend.Models
{
    [Table("projects")]
    public class Project
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProjectID { get; set; }

        [Required]
        [Column(TypeName = "varchar(150)")]
        public string ProjectName { get; set; } = null!;

        [Required]
        [Column(TypeName = "text")]
        public string Description { get; set; } = null!;

        [Column(TypeName = "datetime")]
        public DateTime? StartDate { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? EndDate { get; set; }

        [Required]
        [Column(TypeName = "varchar(50)")]
        public string Status { get; set; } = null!;

        public ICollection<Module> Modules { get; set; }
            = new List<Module>();
    }
}
