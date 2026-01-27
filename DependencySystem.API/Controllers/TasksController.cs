using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TasksController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create(TaskEntity task)
    {
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        return Ok(task);
    }

    [HttpGet("module/{moduleId}")]
    public async Task<IActionResult> GetByModule(int moduleId)
    {
        return Ok(await _context.Tasks
            .Where(t => t.ModuleID == moduleId)
            .ToListAsync());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return Ok("Task deleted");
    }
}
