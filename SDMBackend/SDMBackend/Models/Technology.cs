using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SDMBackend.Models
{
    [Table("technologies")]
    public class Technology
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TechID { get; set; }

        [Required]
        [Column(TypeName = "varchar(100)")]
        public string TechName { get; set; } = null!;

        [Required]
        [Column(TypeName = "varchar(100)")]
        public string Category { get; set; } = null!;

        public ICollection<ModuleTechnology> ModuleTechnologies { get; set; }
            = new List<ModuleTechnology>();
    }
}
