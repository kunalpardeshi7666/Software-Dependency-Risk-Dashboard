using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SDMBackend.DAL;
using SDMBackend.DTOs;
using SDMBackend.Models;

namespace SDMBackend.Controllers
{
    [ApiController]
    [Route("api/technologies")]
    public class TechnologiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TechnologiesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🔹 GET all technologies
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var techs = await _context.Technologies
                .Select(t => new TechnologyDTO
                {
                    TechID = t.TechID,
                    TechName = t.TechName,
                    Category = t.Category
                })
                .ToListAsync();
            return Ok(techs);
        }

        // 🔹 GET technology by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var tech = await _context.Technologies
                .Where(t => t.TechID == id)
                .Select(t => new TechnologyDTO
                {
                    TechID = t.TechID,
                    TechName = t.TechName,
                    Category = t.Category
                })
                .FirstOrDefaultAsync();

            if (tech == null) return NotFound("Technology not found");

            return Ok(tech);
        }

        // 🔹 CREATE new technology
        [HttpPost]
        public async Task<IActionResult> Create(TechnologyDTO dto)
        {
            if (string.IsNullOrEmpty(dto.TechName))
                return BadRequest("TechName is required");

            var tech = new Technology
            {
                TechName = dto.TechName,
                Category = dto.Category
            };

            _context.Technologies.Add(tech);
            await _context.SaveChangesAsync();
            dto.TechID = tech.TechID;

            return Ok(dto);
        }

        // 🔹 UPDATE technology
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TechnologyDTO dto)
        {
            var tech = await _context.Technologies.FindAsync(id);
            if (tech == null) return NotFound("Technology not found");

            tech.TechName = dto.TechName;
            tech.Category = dto.Category;

            await _context.SaveChangesAsync();
            dto.TechID = tech.TechID;

            return Ok(dto);
        }

        // 🔹 DELETE technology
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var tech = await _context.Technologies.FindAsync(id);
            if (tech == null) return NotFound("Technology not found");

            _context.Technologies.Remove(tech);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Technology deleted successfully" });
        }
    }
}
