using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using DependencySystem.API.DAL;
using DependencySystem.API.Models;

[ApiController]
[Route("api/modules")]
[Authorize] // ✅ Login required
public class ModulesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ModulesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ✅ ReadOnly + Admin + Developer can view modules by project
    [HttpGet("project/{projectId}")]
    [Authorize(Roles = "Admin,Developer,ReadOnly")]
    public async Task<IActionResult> GetByProject(int projectId)
    {
        var modules = await _context.Modules
            .Where(m => m.ProjectID == projectId)
            .ToListAsync();

        return Ok(modules);
    }

    // ✅ Only Admin + Developer can create
    [HttpPost]
    [Authorize(Roles = "Admin,Developer")]
    public async Task<IActionResult> Create(Module module)
    {
        _context.Modules.Add(module);
        await _context.SaveChangesAsync();
        return Ok(module);
    }

    // ✅ Only Admin + Developer can update
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Developer")]
    public async Task<IActionResult> Update(int id, Module module)
    {
        if (id != module.ModuleID) return BadRequest();

        _context.Entry(module).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return Ok(module);
    }

    // ✅ Only Admin can delete
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var module = await _context.Modules.FindAsync(id);
        if (module == null) return NotFound();

        _context.Modules.Remove(module);
        await _context.SaveChangesAsync();

        return Ok("Module deleted");
    }
}
