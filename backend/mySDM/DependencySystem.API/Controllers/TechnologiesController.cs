using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using DependencySystem.API.DAL;
using DependencySystem.API.Models;

[ApiController]
[Route("api/technologies")]
[Authorize] // ✅ Login required
public class TechnologiesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TechnologiesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ✅ CREATE Technology (Admin + Developer only)
    [HttpPost]
    [Authorize(Roles = "Admin,Developer")]
    public async Task<IActionResult> Create([FromBody] Technology tech)
    {
        try
        {
            if (tech == null)
                return BadRequest(new { message = "Request body is empty." });

            // ✅ Basic validation (update property name if different)
            if (string.IsNullOrWhiteSpace(tech.Name))
                return BadRequest(new { message = "Technology name is required." });

            // ✅ Prevent duplicate technology names
            bool exists = await _context.Technologies
                .AnyAsync(t => t.Name.ToLower() == tech.Name.ToLower());

            if (exists)
                return Conflict(new { message = "Technology already exists." });

            _context.Technologies.Add(tech);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Technology created successfully",
                technology = tech
            });
        }
        catch (DbUpdateException)
        {
            return StatusCode(500, new { message = "Database update failed while creating technology." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Something went wrong while creating technology.",
                error = ex.Message
            });
        }
    }

    // ✅ GET All Technologies (ReadOnly + Admin + Developer)
    [HttpGet]
    [Authorize(Roles = "Admin,Developer,ReadOnly")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var list = await _context.Technologies.ToListAsync();
            return Ok(list);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Something went wrong while fetching technologies.",
                error = ex.Message
            });
        }
    }
}
