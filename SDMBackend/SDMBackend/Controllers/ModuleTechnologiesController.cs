using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SDMBackend.DAL;
using SDMBackend.DTOs;
using SDMBackend.Models;

namespace SDMBackend.Controllers
{
    [ApiController]
    [Route("api/module-technologies")]
    public class ModuleTechnologiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ModuleTechnologiesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Add technology to a module
        [HttpPost]
        public async Task<IActionResult> Add(ModuleTechnologyDTO dto)
        {
            // Check module exists
            var moduleExists = await _context.Modules.AnyAsync(m => m.ModuleID == dto.ModuleID);
            if (!moduleExists) return NotFound("Module not found");

            // Check technology exists
            var techExists = await _context.Technologies.AnyAsync(t => t.TechID == dto.TechID);
            if (!techExists) return NotFound("Technology not found");

            // Check duplicate
            var alreadyAdded = await _context.ModuleTechnologies
                .AnyAsync(mt => mt.ModuleID == dto.ModuleID && mt.TechID == dto.TechID);
            if (alreadyAdded) return BadRequest("This technology is already added to the module");

            var mt = new ModuleTechnology
            {
                ModuleID = dto.ModuleID,
                TechID = dto.TechID
            };

            _context.ModuleTechnologies.Add(mt);
            await _context.SaveChangesAsync();
            return Ok(dto);
        }

        // Get all technologies for a module
        [HttpGet("module/{moduleId}")]
        public async Task<IActionResult> GetByModule(int moduleId)
        {
            var techs = await _context.ModuleTechnologies
                .Where(mt => mt.ModuleID == moduleId)
                .Select(mt => new ModuleTechnologyDTO
                {
                    ModuleID = mt.ModuleID,
                    TechID = mt.TechID
                })
                .ToListAsync();

            return Ok(techs);
        }

        // Remove a technology from a module
        [HttpDelete]
        public async Task<IActionResult> Remove(ModuleTechnologyDTO dto)
        {
            var mt = await _context.ModuleTechnologies
                .FirstOrDefaultAsync(mt => mt.ModuleID == dto.ModuleID && mt.TechID == dto.TechID);

            if (mt == null) return NotFound("Module-Technology link not found");

            _context.ModuleTechnologies.Remove(mt);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Technology removed from module" });
        }
    }
}
