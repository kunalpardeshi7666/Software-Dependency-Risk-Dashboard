using System.ComponentModel.DataAnnotations.Schema;

namespace SDMBackend.Models
{
    [Table("module_technologies")]
    public class ModuleTechnology
    {
        public int ModuleID { get; set; }

        [ForeignKey(nameof(ModuleID))]
        public Module? Module { get; set; }

        public int TechID { get; set; }

        [ForeignKey(nameof(TechID))]
        public Technology? Technology { get; set; }
    }
}
