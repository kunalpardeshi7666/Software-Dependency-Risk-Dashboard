using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/modules")]
public class ModulesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ModulesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetByProject(int projectId)
    {
        var modules = await _context.Modules
            .Where(m => m.ProjectID == projectId)
            .ToListAsync();

        return Ok(modules);
    }
    [HttpPost]
    public async Task<IActionResult> Create(Module module)
    {
        _context.Modules.Add(module);
        await _context.SaveChangesAsync();
        return Ok(module);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Module module)
    {
        if (id != module.ModuleID) return BadRequest();

        _context.Entry(module).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return Ok(module);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var module = await _context.Modules.FindAsync(id);
        if (module == null) return NotFound();

        _context.Modules.Remove(module);
        await _context.SaveChangesAsync();

        return Ok("Module deleted");
    }

}
