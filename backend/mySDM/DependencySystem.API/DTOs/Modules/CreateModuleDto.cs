using DependencySystem.API.Model.module.enums;
using System.ComponentModel.DataAnnotations;

namespace DependencySystem.API.DTOs.Modules
{
    public class CreateModuleDto
    {
        [Required]
        public int ProjectID { get; set; }

        [Required]
        [StringLength(200)]
        public string ModuleName { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        public string Version { get; set; } = "1.0.0";
        public ModuleStatus Status { get; set; } = ModuleStatus.Pending;


    }
}
