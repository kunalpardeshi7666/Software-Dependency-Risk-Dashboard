using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SDMBackend.DAL;
using SDMBackend.DTOs;
using SDMBackend.Models;

namespace SDMBackend.Controllers
{
    [ApiController]
    [Route("api/projects")]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/projects
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await _context.Projects
                .Select(p => new ProjectDTO
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

        // GET: api/projects/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var project = await _context.Projects
                .Where(p => p.ProjectID == id)
                .Select(p => new ProjectDTO
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
                return NotFound("Project not found");

            return Ok(project);
        }

        // POST: api/projects
        [HttpPost]
        public async Task<IActionResult> Create(ProjectDTO dto)
        {
            if (string.IsNullOrEmpty(dto.ProjectName))
                return BadRequest("ProjectName is required");
            if (string.IsNullOrEmpty(dto.Description))
                return BadRequest("Description is required");
            if (string.IsNullOrEmpty(dto.Status))
                dto.Status = "Not Started"; // default value

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

            dto.ProjectID = project.ProjectID;
            return Ok(dto);
        }

        // PUT: api/projects/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ProjectDTO dto)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
                return NotFound("Project not found");

            project.ProjectName = dto.ProjectName ?? project.ProjectName;
            project.Description = dto.Description ?? project.Description;
            project.StartDate = dto.StartDate ?? project.StartDate;
            project.EndDate = dto.EndDate ?? project.EndDate;
            project.Status = dto.Status ?? project.Status;

            await _context.SaveChangesAsync();

            dto.ProjectID = project.ProjectID;
            return Ok(dto);
        }

        // DELETE: api/projects/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
                return NotFound("Project not found");

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Project deleted successfully" });
        }
    }
}
