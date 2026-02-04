using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using DependencySystem.API.DAL;
using DependencySystem.API.Models;

[ApiController]
[Route("api/tasks")]
[Authorize] // ✅ Login required for all endpoints
public class TasksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TasksController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ✅ CREATE TASK (Admin + Developer only)
    [HttpPost]
    [Authorize(Roles = "Admin,Developer")]
    public async Task<IActionResult> Create(TaskEntity task)
    {
        // 🔒 Validate Module
        bool moduleExists = await _context.Modules
            .AnyAsync(m => m.ModuleID == task.ModuleID);

        if (!moduleExists)
            return BadRequest("Invalid ModuleID");

        // 🔒 Validate Developer
        bool developerExists = await _context.Developers
            .AnyAsync(d => d.DeveloperID == task.DeveloperID);

        if (!developerExists)
            return BadRequest("Invalid DeveloperID");

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return Ok(task);
    }

    // ✅ GET TASKS BY MODULE (ReadOnly + Admin + Developer)
    [HttpGet("module/{moduleId}")]
    [Authorize(Roles = "Admin,Developer,ReadOnly")]
    public async Task<IActionResult> GetByModule(int moduleId)
    {
        var tasks = await _context.Tasks
            .Where(t => t.ModuleID == moduleId)
            .ToListAsync();

        return Ok(tasks);
    }

    // ✅ DELETE TASK (Admin only)
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
            return NotFound("Task not found");

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return Ok("Task deleted");
    }
}
