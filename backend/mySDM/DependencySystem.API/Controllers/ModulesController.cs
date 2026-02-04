using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using DependencySystem.API.DAL;
using DependencySystem.API.DTOs.Modules;

namespace DependencySystem.API.Controllers
{
    [ApiController]
    [Route("api/modules")]
    //[Authorize]
    public class ModulesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ModulesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ Get all modules
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var modules = await _context.Modules
                .Select(m => new ModuleResponseDto
                {
                    ModuleID = m.ModuleID,
                    ProjectID = m.ProjectID,
                    ModuleName = m.ModuleName,
                    Description = m.Description,
                    Status = m.Status
                })
                .ToListAsync();

            return Ok(modules);
        }

            // ✅ Get modules by project
            [HttpGet("project/{projectId}")]
        //[Authorize(Roles = "Admin,Developer,Tester,User")]
        public async Task<IActionResult> GetByProject(int projectId)
        {
            var modules = await _context.Modules
                .Where(m => m.ProjectID == projectId)
                .Select(m => new ModuleResponseDto
                {
                    ModuleID = m.ModuleID,
                    ProjectID = m.ProjectID,
                    ModuleName = m.ModuleName,
                   
                    Description = m.Description,
                    Status = m.Status
                })
                .ToListAsync();

            return Ok(modules);
        }

        // ✅ Create module
        [HttpPost]
        //[Authorize(Roles = "Admin,Developer")]
        public async Task<IActionResult> Create([FromBody] CreateModuleDto dto)
        {
            var projectExists = await _context.Projects.AnyAsync(p => p.ProjectID == dto.ProjectID);
            if (!projectExists)
                return BadRequest(new { message = "Invalid ProjectID (Project not found)" });

            var module = new Module
            {
                ProjectID = dto.ProjectID,
                ModuleName = dto.ModuleName,
                Description = dto.Description,
                Version = dto.Version,
                Status = dto.Status
            };

            _context.Modules.Add(module);
            await _context.SaveChangesAsync();

            var response = new ModuleResponseDto
            {
                ModuleID = module.ModuleID,
                ProjectID = module.ProjectID,
                ModuleName = module.ModuleName,
                Description = module.Description,
                Status = module.Status
            };

            return Ok(response);
        }

        // ✅ Update module
        [HttpPut("{id}")]
        //[Authorize(Roles = "Admin,Developer")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateModuleDto dto)
        {
            if (id != dto.ModuleID)
                return BadRequest(new { message = "ModuleID mismatch" });

            var module = await _context.Modules.FirstOrDefaultAsync(m => m.ModuleID == id);
            if (module == null)
                return NotFound(new { message = "Module not found" });

            var projectExists = await _context.Projects.AnyAsync(p => p.ProjectID == dto.ProjectID);
            if (!projectExists)
                return BadRequest(new { message = "Invalid ProjectID (Project not found)" });

            module.ProjectID = dto.ProjectID;
            module.ModuleName = dto.ModuleName;
            module.Description = dto.Description;
            module.Status = dto.Status;

            await _context.SaveChangesAsync();

            var response = new ModuleResponseDto
            {
                ModuleID = module.ModuleID,
                ProjectID = module.ProjectID,
                ModuleName = module.ModuleName,
                Description = module.Description,
                Status = module.Status
            };

            return Ok(response);
        }

        // ✅ Delete module (Admin only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var module = await _context.Modules.FindAsync(id);
            if (module == null)
                return NotFound(new { message = "Module not found" });

            _context.Modules.Remove(module);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Module deleted successfully" });
        }
    }

}