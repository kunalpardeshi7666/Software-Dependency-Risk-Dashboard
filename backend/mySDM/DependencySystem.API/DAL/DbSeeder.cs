using DependencySystem.API.DAL;
using DependencySystem.API.Models;
using DependencySystem.API.Model.module.enums;

public static class AdvancedDbSeeder
{
    public static void Seed(ApplicationDbContext context)
    {
        if (context.Projects.Any())
            return;

        using var transaction = context.Database.BeginTransaction();

        var random = new Random();

        // 1️⃣ Project
        var project = new Project
        {
            ProjectName = "Enterprise Dependency System",
            Description = "Large-scale seeded project with 100+ modules",
            Status = "Active"
        };

        context.Projects.Add(project);
        context.SaveChanges();

        // 2️⃣ Modules
        var modules = Enumerable.Range(1, 100)
            .Select(i => new Module
            {
                ProjectID = project.ProjectID,
                ModuleName = $"Module-{i}",
                Description = $"Auto-generated module #{i}",
                Status = (ModuleStatus)random.Next(0, 4)
            })
            .ToList();

        context.Modules.AddRange(modules);
        context.SaveChanges();

        // 3️⃣ DAG Dependencies
        var dependencies = new List<Dependency>();
        var dependencySet = new HashSet<(int, int)>();

        foreach (var module in modules)
        {
            int dependencyCount = random.Next(0, 4);

            var targets = modules
                .Where(m => m.ModuleID < module.ModuleID)
                .OrderBy(_ => random.Next())
                .Take(dependencyCount);

            foreach (var target in targets)
            {
                var key = (module.ModuleID, target.ModuleID);
                if (!dependencySet.Add(key))
                    continue;

                dependencies.Add(new Dependency
                {
                    SourceModuleID = module.ModuleID,
                    TargetModuleID = target.ModuleID
                });
            }
        }

        context.Dependencies.AddRange(dependencies);
        context.SaveChanges();

        transaction.Commit();
    }
}
