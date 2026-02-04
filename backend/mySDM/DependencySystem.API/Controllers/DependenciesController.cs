using DependencySystem.API.DAL;
using DependencySystem.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/dependencies")]
//[Authorize] // ✅ Login required for all endpoints
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

    // ✅ CREATE dependency (Admin + Developer only)
    [HttpPost]
    //[Authorize(Roles = "Admin,Developer")]
    public async Task<IActionResult> Create([FromBody] Dependency dependency)
    {
        try
        {
            if (dependency == null)
                return BadRequest(new { message = "Request body is empty." });

            if (dependency.ModuleID <= 0 || dependency.DependsOnModuleID <= 0)
                return BadRequest(new { message = "ModuleID and DependsOnModuleID must be valid IDs." });

            if (dependency.ModuleID == dependency.DependsOnModuleID)
                return BadRequest(new { message = "A module cannot depend on itself." });

            // ✅ Validate Module exists
            bool moduleExists = await _context.Modules.AnyAsync(m => m.ModuleID == dependency.ModuleID);
            if (!moduleExists)
                return BadRequest(new { message = "Invalid ModuleID (module does not exist)." });

            // ✅ Validate DependsOnModule exists
            bool dependsOnExists = await _context.Modules.AnyAsync(m => m.ModuleID == dependency.DependsOnModuleID);
            if (!dependsOnExists)
                return BadRequest(new { message = "Invalid DependsOnModuleID (module does not exist)." });

            // ✅ Prevent duplicate dependency
            bool duplicateExists = await _context.Dependencies.AnyAsync(d =>
                d.ModuleID == dependency.ModuleID &&
                d.DependsOnModuleID == dependency.DependsOnModuleID);

            if (duplicateExists)
                return Conflict(new { message = "Dependency already exists." });

            // ✅ Check Circular Dependency
            bool hasCycle = await _dependencyService.HasCircularDependency(
                dependency.ModuleID,
                dependency.DependsOnModuleID);

            if (hasCycle)
                return BadRequest(new { message = "Circular dependency detected." });

            _context.Dependencies.Add(dependency);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Dependency created successfully",
                dependency
            });
        }
        catch (DbUpdateException)
        {
            return StatusCode(500, new { message = "Database update failed while creating dependency." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Something went wrong while creating dependency.",
                error = ex.Message
            });
        }
    }

    // ✅ GET all dependencies (ReadOnly + Admin + Developer)
    [HttpGet]
    //[Authorize(Roles = "Admin,Developer,ReadOnly")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var list = await _context.Dependencies.ToListAsync();
            return Ok(list);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Something went wrong while fetching dependencies.",
                error = ex.Message
            });
        }
    }

    // ✅ GET dependencies by project (ReadOnly + Admin + Developer)
    [HttpGet("project/{projectId}")]
    //[Authorize(Roles = "Admin,Developer,ReadOnly")]
    public async Task<IActionResult> GetByProject(int projectId)
    {
        try
        {
            if (projectId <= 0)
                return BadRequest(new { message = "Invalid projectId." });

            // ✅ Validate project exists
            bool projectExists = await _context.Projects.AnyAsync(p => p.ProjectID == projectId);
            if (!projectExists)
                return NotFound(new { message = "Project not found." });

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
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Something went wrong while fetching dependencies by project.",
                error = ex.Message
            });
        }
    }

    // ✅ DELETE dependency (Admin only)
    [HttpDelete("{id}")]
    //[Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid dependency id." });

            var dep = await _context.Dependencies.FindAsync(id);
            if (dep == null)
                return NotFound(new { message = "Dependency not found." });

            _context.Dependencies.Remove(dep);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Dependency removed successfully." });
        }
        catch (DbUpdateException)
        {
            return StatusCode(500, new { message = "Database update failed while deleting dependency." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Something went wrong while deleting dependency.",
                error = ex.Message
            });
        }
    }
}
