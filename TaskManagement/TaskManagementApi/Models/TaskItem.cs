using System.ComponentModel.DataAnnotations;

namespace TaskManagementApi.Models
{
    public class TaskItem
    {
        [Key]
        public int TaskID { get; set; }     // Primary Key

        [Required]
        public string TaskName { get; set; }

        [Required]
        public string Status { get; set; }

        [Required]
        public string Priority { get; set; }

        public int ModuleID { get; set; }       // Foreign Key (no relation now)
        public int DeveloperID { get; set; }    // Foreign Key (no relation now)
    }
}
