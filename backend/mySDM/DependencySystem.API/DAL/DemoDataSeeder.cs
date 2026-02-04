using DependencySystem.API.DAL;
using DependencySystem.API.Models;
using DependencySystem.API.Model;
using DependencySystem.API.Model.module.enums;
using Microsoft.AspNetCore.Identity;
using System.Diagnostics;

namespace DependencySystem.API.DAL.Seed
{
    public static class DemoDataSeeder
    {
        public static async Task SeedAsync(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            Debug.WriteLine("🚀 ---------------------------------------------------------------------------DemoDataSeeder STARTED---------------------------------------------------------------------------");

            // =============================
            // PROJECTS
            // =============================
            if (!context.Projects.Any())
            {
                for (int i = 1; i <= 15; i++)
                {
                    context.Projects.Add(new Project
                    {
                        ProjectName = $"Demo Project {i}",
                        Description = $"Demo project {i}",
                        Status = "Active",
                        StartDate = DateTime.UtcNow.AddDays(-i * 10)
                    });
                }
                await context.SaveChangesAsync();
            }

            var projects = context.Projects.ToList();

            // =============================
            // MODULES
            // =============================
            foreach (var project in projects)
            {
                if (!context.Modules.Any(m => m.ProjectID == project.ProjectID))
                {
                    var modules = new List<Module>();

                    for (int i = 1; i <= 30; i++)
                    {
                        modules.Add(new Module
                        {
                            ProjectID = project.ProjectID,
                            ModuleName = $"{project.ProjectName}-Module-{i}",
                            Description = $"Module {i}",
                            Status = (ModuleStatus)(i % 4)
                        });
                    }

                    context.Modules.AddRange(modules);
                    await context.SaveChangesAsync();

                    // =============================
                    // DEPENDENCIES (EDGES)
                    // =============================
                    var dependencies = new List<Dependency>
                    {
                        new() { ModuleID = modules[1].ModuleID, DependsOnModuleID = modules[0].ModuleID },
                        new() { ModuleID = modules[2].ModuleID, DependsOnModuleID = modules[1].ModuleID },
                        new() { ModuleID = modules[3].ModuleID, DependsOnModuleID = modules[2].ModuleID },
                        new() { ModuleID = modules[4].ModuleID, DependsOnModuleID = modules[1].ModuleID },
                        new() { ModuleID = modules[5].ModuleID, DependsOnModuleID = modules[0].ModuleID },
                        new() { ModuleID = modules[6].ModuleID, DependsOnModuleID = modules[4].ModuleID },
                        new() { ModuleID = modules[7].ModuleID, DependsOnModuleID = modules[6].ModuleID },
                        new() { ModuleID = modules[8].ModuleID, DependsOnModuleID = modules[3].ModuleID },
                        new() { ModuleID = modules[9].ModuleID, DependsOnModuleID = modules[0].ModuleID }
                    };

                    context.Dependencies.AddRange(dependencies);
                    await context.SaveChangesAsync();
                }
            }

            // =============================
            // USERS
            // =============================
            if (!context.Users.Any(u => u.Email!.StartsWith("demo")))
            {
                for (int i = 1; i <= 20; i++)
                {
                    var user = new ApplicationUser
                    {
                        UserName = $"demo{i}@demo.com",
                        Email = $"demo{i}@demo.com",
                        EmailConfirmed = true,
                        FirstName = "Demo",
                        LastName = $"User{i}"
                    };

                    await userManager.CreateAsync(user, "Demo@123");
                }
            }

            Debug.WriteLine("✅---------------------------------------------------- DemoDataSeeder COMPLETED-------------------------------------------------------");
        }
    }
}
