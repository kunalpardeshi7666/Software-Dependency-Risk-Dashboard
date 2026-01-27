using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/dependencies")]
public class DependenciesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly DependencyService _dependencyService;

    public DependenciesController(
        ApplicationDbContext context,
        DependencyService dependencyService)
    {
        _context = context;
        _dependencyService = dependencyService;
    }

    // CREATE dependency
    [HttpPost]
    public async Task<IActionResult> Create(Dependency dependency)
    {
        bool hasCycle = await _dependencyService.HasCircularDependency(
            dependency.ModuleID,
            dependency.DependsOnModuleID);

        if (hasCycle)
            return BadRequest("Circular dependency detected");

        _context.Dependencies.Add(dependency);
        await _context.SaveChangesAsync();

        return Ok(dependency);
    }

    // GET all dependencies (for testing)
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _context.Dependencies.ToListAsync());
    }

    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetByProject(int projectId)
    {
        var dependencies = await _context.Dependencies
            .Join(
                _context.Modules,
                d => d.ModuleID,
                m => m.ModuleID,
                (d, m) => new { d, m }
            )
            .Where(x => x.m.ProjectID == projectId)
            .Select(x => x.d)
            .ToListAsync();

        return Ok(dependencies);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var dep = await _context.Dependencies.FindAsync(id);
        if (dep == null) return NotFound();

        _context.Dependencies.Remove(dep);
        await _context.SaveChangesAsync();

        return Ok("Dependency removed");
    }

}
