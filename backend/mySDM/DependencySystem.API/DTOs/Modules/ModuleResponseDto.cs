//namespace DependencySystem.API.DTOs.Modules
using DependencySystem.API.Model.module.enums;

namespace DependencySystem.API.DTOs.Modules
{
    public class ModuleResponseDto
    {
        public int ModuleID { get; set; }
        public int ProjectID { get; set; }
        public string ModuleName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public ModuleStatus Status { get; set; }

    }
}
