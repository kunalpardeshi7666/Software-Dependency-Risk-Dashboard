using System.ComponentModel.DataAnnotations;

namespace DependencySystem.API.DTOs.Projects
{
    public class ProjectUpdateDto
    {
        [Required]
        public int ProjectID { get; set; }

        [Required]
        [StringLength(200)]
        public string ProjectName { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        [StringLength(50)]
        public string? Status { get; set; } = "Pending";
    }
}
