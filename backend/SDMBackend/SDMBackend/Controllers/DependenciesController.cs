using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SDMBackend.DAL;
using SDMBackend.DTOs;
using SDMBackend.Models;

[ApiController]
[Route("api/dependencies")]
public class DependenciesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DependenciesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ➕ Create dependency
    [HttpPost]
    public async Task<IActionResult> Create(DependencyDTO dto)
    {
        if (dto.ModuleID == dto.DependsOnModuleID)
            return BadRequest("A module cannot depend on itself");

        bool exists = await _context.Dependencies.AnyAsync(d =>
            d.ModuleID == dto.ModuleID &&
            d.DependsOnModuleID == dto.DependsOnModuleID);

        if (exists)
            return BadRequest("Dependency already exists");

        var dependency = new Dependency
        {
            ModuleID = dto.ModuleID,
            DependsOnModuleID = dto.DependsOnModuleID
        };

        _context.Dependencies.Add(dependency);
        await _context.SaveChangesAsync();

        dto.DependencyID = dependency.DependencyID;
        return Ok(dto);
    }

    // 📦 Get dependencies by MODULE
    [HttpGet("module/{moduleId}")]
    public async Task<IActionResult> GetByModule(int moduleId)
    {
        var deps = await _context.Dependencies
            .Where(d => d.ModuleID == moduleId)
            .Select(d => new DependencyDTO
            {
                DependencyID = d.DependencyID,
                ModuleID = d.ModuleID,
                DependsOnModuleID = d.DependsOnModuleID
            })
            .ToListAsync();

        return Ok(deps);
    }

    // 📦 Get dependencies by PROJECT
    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetByProject(int projectId)
    {
        var deps = await _context.Dependencies
            .Join(_context.Modules,
                d => d.ModuleID,
                m => m.ModuleID,
                (d, m) => new { d, m })
            .Where(x => x.m.ProjectID == projectId)
            .Select(x => new DependencyDTO
            {
                DependencyID = x.d.DependencyID,
                ModuleID = x.d.ModuleID,
                DependsOnModuleID = x.d.DependsOnModuleID
            })
            .ToListAsync();

        return Ok(deps);
    }

    // ❌ Delete dependency
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var dep = await _context.Dependencies.FindAsync(id);
        if (dep == null)
            return NotFound("Dependency not found");

        _context.Dependencies.Remove(dep);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Dependency deleted successfully" });
    }
}
