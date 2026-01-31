using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SDMBackend.Models
{
    [Table("users")] // MySQL is case-sensitive on Linux
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserID { get; set; }

        [Required]
        [Column(TypeName = "varchar(100)")]
        public string Name { get; set; } = null!;

        [Required]
        [Column(TypeName = "varchar(150)")]
        public string Email { get; set; } = null!;

        [Required]
        [Column(TypeName = "varchar(255)")]
        public string PasswordHash { get; set; } = null!;

        // Admin or Developer
        [Required]
        [Column(TypeName = "varchar(50)")]
        public string Role { get; set; } = null!;

        public Developer? Developer { get; set; }
    }
}
