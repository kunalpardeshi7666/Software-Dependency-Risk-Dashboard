using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using DependencySystem.API.DAL;
using DependencySystem.API.Models;
using DependencySystem.API.DTOs.Projects;

namespace DependencySystem.API.Controllers
{
    [ApiController]
    [Route("api/projects")]
    //[Authorize] // ✅ Login required
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ ReadOnly + Admin + Developer can view all
        [HttpGet]
        //[Authorize(Roles = "Admin,Developer,ReadOnly")]
        public async Task<IActionResult> GetAll()
        {
            var projects = await _context.Projects
                .OrderByDescending(p => p.ProjectID)
                .Select(p => new ProjectReadDto
                {
                    ProjectID = p.ProjectID,
                    ProjectName = p.ProjectName,
                    Description = p.Description,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    Status = p.Status
                })
                .ToListAsync();

            return Ok(projects);
        }

        // ✅ ReadOnly + Admin + Developer can view single
        [HttpGet("{id}")]
        //[Authorize(Roles = "Admin,Developer,ReadOnly")]
        public async Task<IActionResult> GetById(int id)
        {
            var project = await _context.Projects
                .Where(p => p.ProjectID == id)
                .Select(p => new ProjectReadDto
                {
                    ProjectID = p.ProjectID,
                    ProjectName = p.ProjectName,
                    Description = p.Description,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    Status = p.Status
                })
                .FirstOrDefaultAsync();

            if (project == null)
                return NotFound(new { message = "Project not found" });

            return Ok(project);
        }

        // ✅ Only Admin + Developer can create
        [HttpPost]
        //[Authorize(Roles = "Admin,Developer")]
        public async Task<IActionResult> Create([FromBody] ProjectCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var project = new Project
            {
                ProjectName = dto.ProjectName,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Status = dto.Status
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            var response = new ProjectReadDto
            {
                ProjectID = project.ProjectID,
                ProjectName = project.ProjectName,
                Description = project.Description,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
                Status = project.Status
            };

            return CreatedAtAction(nameof(GetById), new { id = project.ProjectID }, response);
        }

        // ✅ Only Admin + Developer can update
        [HttpPut("{id}")]
        //[Authorize(Roles = "Admin,Developer")]
        public async Task<IActionResult> Update(int id, [FromBody] ProjectUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (id != dto.ProjectID)
                return BadRequest(new { message = "Project ID mismatch" });

            var existing = await _context.Projects.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = "Project not found" });

            existing.ProjectName = dto.ProjectName;
            existing.Description = dto.Description;
            existing.StartDate = dto.StartDate;
            existing.EndDate = dto.EndDate;
            existing.Status = dto.Status;

            await _context.SaveChangesAsync();

            var response = new ProjectReadDto
            {
                ProjectID = existing.ProjectID,
                ProjectName = existing.ProjectName,
                Description = existing.Description,
                StartDate = existing.StartDate,
                EndDate = existing.EndDate,
                Status = existing.Status
            };

            return Ok(response);
        }

        // ✅ Only Admin can delete
        [HttpDelete("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
                return NotFound(new { message = "Project not found" });

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Project deleted successfully" });
        }
    }
}
