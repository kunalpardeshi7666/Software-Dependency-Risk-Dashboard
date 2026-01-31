using Microsoft.EntityFrameworkCore;
using DependencySystem.API.DAL;
public class DependencyService
{
    private readonly ApplicationDbContext _context;

    public DependencyService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HasCircularDependency(int moduleId, int dependsOnId)
    {
        var visited = new HashSet<int>();
        return await DFS(dependsOnId, moduleId, visited);
    }

    private async Task<bool> DFS(int current, int target, HashSet<int> visited)
    {
        if (current == target) return true;
        if (visited.Contains(current)) return false;

        visited.Add(current);

        var deps = await _context.Dependencies
            .Where(d => d.ModuleID == current)
            .Select(d => d.DependsOnModuleID)
            .ToListAsync();

        foreach (var d in deps)
            if (await DFS(d, target, visited))
                return true;

        return false;
    }
}
