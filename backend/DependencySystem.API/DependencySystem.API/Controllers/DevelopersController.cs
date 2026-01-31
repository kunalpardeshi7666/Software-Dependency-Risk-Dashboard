using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using DependencySystem.API.DAL;

[ApiController]
[Route("api/[controller]")]
//[Authorize] // ✅ login required
public class DevelopersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DevelopersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ✅ GET: api/developers (Admin + Developer + ReadOnly)
    [HttpGet]
    //[Authorize(Roles = "Admin,Developer,ReadOnly")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var developers = await _context.Developers.ToListAsync();
            return Ok(developers);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Something went wrong while fetching developers.",
                error = ex.Message
            });
        }
    }

    // ✅ POST: api/developers (Admin + Developer only)
    [HttpPost]
    //[Authorize(Roles = "Admin,Developer")]
    public async Task<IActionResult> Create([FromBody] Developer developer)
    {
        try
        {
            if (developer == null)
                return BadRequest(new { message = "Request body is empty." });

            // ✅ Validation
            if (string.IsNullOrWhiteSpace(developer.DeveloperName))
                return BadRequest(new { message = "DeveloperName is required." });

            if (string.IsNullOrWhiteSpace(developer.Email))
                return BadRequest(new { message = "Email is required." });

            if (string.IsNullOrWhiteSpace(developer.Role))
                return BadRequest(new { message = "Role is required." });

            // ✅ Optional: experience validation
            if (developer.Experience < 0)
                return BadRequest(new { message = "Experience cannot be negative." });

            // ✅ Allow only valid roles (recommended)
            var validRoles = new[] { "Admin", "Developer", "ReadOnly" };
            if (!validRoles.Contains(developer.Role))
                return BadRequest(new { message = "Invalid Role. Allowed: Admin, Developer, ReadOnly" });

            // ✅ Duplicate email check
            bool exists = await _context.Developers.AnyAsync(d =>
                d.Email.ToLower() == developer.Email.ToLower());

            if (exists)
                return Conflict(new { message = "Developer with this email already exists." });

            _context.Developers.Add(developer);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Developer created successfully",
                developer
            });
        }
        catch (DbUpdateException)
        {
            return StatusCode(500, new { message = "Database update failed while creating developer." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Something went wrong while creating developer.",
                error = ex.Message
            });
        }
    }
    // ✅ PUT: api/developers/{id}  (Admin only)
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] Developer developer)
    {
        try
        {
            if (developer == null)
                return BadRequest(new { message = "Request body is empty." });

            if (id != developer.DeveloperID)
                return BadRequest(new { message = "DeveloperID mismatch with URL id." });

            var existing = await _context.Developers.FirstOrDefaultAsync(d => d.DeveloperID == id);
            if (existing == null)
                return NotFound(new { message = "Developer not found." });

            // ✅ Validation
            if (string.IsNullOrWhiteSpace(developer.DeveloperName))
                return BadRequest(new { message = "DeveloperName is required." });

            if (string.IsNullOrWhiteSpace(developer.Email))
                return BadRequest(new { message = "Email is required." });

            if (string.IsNullOrWhiteSpace(developer.Role))
                return BadRequest(new { message = "Role is required." });

            if (developer.Experience < 0)
                return BadRequest(new { message = "Experience cannot be negative." });

            // ✅ Allowed roles
            var validRoles = new[] { "Admin", "Developer", "ReadOnly" };
            if (!validRoles.Contains(developer.Role))
                return BadRequest(new { message = "Invalid Role. Allowed: Admin, Developer, ReadOnly" });

            // ✅ Duplicate email check (excluding same developer)
            bool emailExists = await _context.Developers.AnyAsync(d =>
                d.Email.ToLower() == developer.Email.ToLower() &&
                d.DeveloperID != id);

            if (emailExists)
                return Conflict(new { message = "Another developer already uses this email." });

            // ✅ Update only required fields (safe update)
            existing.DeveloperName = developer.DeveloperName;
            existing.Email = developer.Email;
            existing.Role = developer.Role;
            existing.Experience = developer.Experience;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Developer updated successfully",
                developer = existing
            });
        }
        catch (DbUpdateException)
        {
            return StatusCode(500, new { message = "Database update failed while updating developer." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Something went wrong while updating developer.",
                error = ex.Message
            });
        }
    }

}
