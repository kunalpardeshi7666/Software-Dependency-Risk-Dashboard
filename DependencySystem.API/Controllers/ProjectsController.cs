using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/projects")]
public class ProjectsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProjectsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _context.Projects.ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Create(Project project)
    {
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();
        return Ok(project);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return NotFound();
        return Ok(project);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Project project)
    {
        if (id != project.ProjectID) return BadRequest();

        _context.Entry(project).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return Ok(project);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return NotFound();

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return Ok("Project deleted");
    }

}
