using DependencySystem.API.Model.module.enums;
using System.ComponentModel.DataAnnotations;

namespace DependencySystem.API.DTOs.Modules
{
    public class UpdateModuleDto
    {
        [Required]
        public int ModuleID { get; set; }

        [Required]
        public int ProjectID { get; set; }

        [Required]
        [StringLength(200)]
        public string ModuleName { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

    
        public ModuleStatus Status { get; set; }

    }
}
