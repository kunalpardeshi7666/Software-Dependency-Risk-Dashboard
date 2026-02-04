using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SDMBackend.Models
{
    [Table("Technologies")]
    public class Technology
    {
        [Key]
        public int TechID { get; set; }
        public string TechName { get; set; } = null!;
        public string Category { get; set; } = null!;
        public ICollection<ModuleTechnology> ModuleTechnologies { get; set; } = new List<ModuleTechnology>();
    }

}
