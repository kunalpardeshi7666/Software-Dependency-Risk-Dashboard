using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SDMBackend.DAL;
using SDMBackend.DTOs;
using SDMBackend.Models;

namespace SDMBackend.Controllers
{
    [ApiController]
    [Route("api/modules")]
    public class ModulesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ModulesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/modules
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var modules = await _context.Modules
                .Select(m => new ModuleDTO
                {
                    ModuleID = m.ModuleID,
                    ModuleName = m.ModuleName,
                    Version = m.Version,
                    ProjectID = m.ProjectID
                })
                .ToListAsync();

            return Ok(modules);
        }

        // GET: api/modules/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var module = await _context.Modules
                .Where(m => m.ModuleID == id)
                .Select(m => new ModuleDTO
                {
                    ModuleID = m.ModuleID,
                    ModuleName = m.ModuleName,
                    Version = m.Version,
                    ProjectID = m.ProjectID
                })
                .FirstOrDefaultAsync();

            if (module == null)
                return NotFound("Module not found");

            return Ok(module);
        }

        // GET: api/modules/project/{projectId}
        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetByProject(int projectId)
        {
            var modules = await _context.Modules
                .Where(m => m.ProjectID == projectId)
                .Select(m => new ModuleDTO
                {
                    ModuleID = m.ModuleID,
                    ModuleName = m.ModuleName,
                    Version = m.Version,
                    ProjectID = m.ProjectID
                })
                .ToListAsync();

            return Ok(modules);
        }

        // POST: api/modules
        [HttpPost]
        public async Task<IActionResult> Create(ModuleDTO dto)
        {
            var module = new Module
            {
                ModuleName = dto.ModuleName,
                Version = dto.Version,
                ProjectID = dto.ProjectID
            };

            _context.Modules.Add(module);
            await _context.SaveChangesAsync();

            dto.ModuleID = module.ModuleID;
            return Ok(dto);
        }

        // PUT: api/modules/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ModuleDTO dto)
        {
            var module = await _context.Modules.FindAsync(id);
            if (module == null)
                return NotFound("Module not found");

            module.ModuleName = dto.ModuleName ?? module.ModuleName;
            module.Version = dto.Version ?? module.Version;
            module.ProjectID = dto.ProjectID != 0 ? dto.ProjectID : module.ProjectID;

            await _context.SaveChangesAsync();

            dto.ModuleID = module.ModuleID;
            return Ok(dto);
        }

        // DELETE: api/modules/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var module = await _context.Modules.FindAsync(id);
            if (module == null)
                return NotFound("Module not found");

            _context.Modules.Remove(module);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Module deleted successfully" });
        }
    }
}
