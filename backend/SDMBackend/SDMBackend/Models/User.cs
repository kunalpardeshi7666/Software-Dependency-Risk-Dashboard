
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SDMBackend.Models {
    [Table("Users")]
    public class User
    {
        [Key]
        public int UserID { get; set; }

        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;

        // "Admin" or "Developer"
        public string Role { get; set; } = null!;

        public Developer? Developer { get; set; }
    }

}


