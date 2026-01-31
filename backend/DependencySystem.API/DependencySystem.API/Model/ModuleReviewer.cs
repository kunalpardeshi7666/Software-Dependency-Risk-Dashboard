// ModuleReviewer.cs
namespace DependencySystem.API.Models
{
    public class ModuleReviewer
    {
        public int ModuleID { get; set; }
        public int DeveloperID { get; set; }
        public ReviewType ReviewType { get; set; }
        public ReviewStatus Status { get; set; } = ReviewStatus.Pending;
        public DateTime AssignedDate { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewedDate { get; set; }

        // Navigation
        public virtual Module? Module { get; set; }
        public virtual Developer? Developer { get; set; }
    }

    public enum ReviewType
    {
        CodeReview = 0,
        DesignReview = 1,
        SecurityReview = 2,
        PerformanceReview = 3
    }

    public enum ReviewStatus
    {
        Pending = 0,
        Approved = 1,
        Rejected = 2,
        NeedsRework = 3
    }
}

// TaskDependency.cs
namespace DependencySystem.API.Models
{
    public class TaskDependency
    {
        public int TaskID { get; set; }
        public int DependsOnTaskID { get; set; }
        public DependencyConstraint Constraint { get; set; }
        public int LagDays { get; set; } = 0;
        public string? Notes { get; set; }

        // Navigation
        public virtual TaskEntity? Task { get; set; }
        public virtual TaskEntity? DependsOnTask { get; set; }
    }

    public enum DependencyConstraint
    {
        FinishToStart = 0,
        StartToStart = 1,
        FinishToFinish = 2,
        StartToFinish = 3
    }
}

// DeveloperTechnology.cs
namespace DependencySystem.API.Models
{
    public class DeveloperTechnology
    {
        public int DeveloperID { get; set; }
        public int TechID { get; set; }
        public ProficiencyLevel Proficiency { get; set; }
        public int YearsOfExperience { get; set; }
        public DateTime LastUsed { get; set; }
        public bool IsCertified { get; set; } = false;

        // Navigation
        public virtual Developer? Developer { get; set; }
        public virtual Technology? Technology { get; set; }
    }

    public enum ProficiencyLevel
    {
        Beginner = 0,
        Intermediate = 1,
        Advanced = 2,
        Expert = 3
    }
}

// ProjectTechnology.cs
namespace DependencySystem.API.Models
{
    public class ProjectTechnology
    {
        public int ProjectID { get; set; }
        public int TechID { get; set; }
        public TechnologyRole Role { get; set; }
        public string? VersionUsed { get; set; }
        public bool IsMandatory { get; set; } = true;
        public DateTime AdoptedDate { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual Project? Project { get; set; }
        public virtual Technology? Technology { get; set; }
    }

    public enum TechnologyRole
    {
        Primary = 0,
        Secondary = 1,
        Legacy = 2,
        Experimental = 3
    }
}