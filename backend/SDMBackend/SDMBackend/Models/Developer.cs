using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SDMBackend.Models
{
    [Table("Developers")]
    public class Developer
    {
        [Key]
        public int DeveloperID { get; set; }

        public int UserID { get; set; }
        public User? User { get; set; }

        public int Experience { get; set; }
    }



}
