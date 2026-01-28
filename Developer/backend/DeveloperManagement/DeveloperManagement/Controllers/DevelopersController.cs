using DeveloperManagement.Data;
using DeveloperManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DeveloperManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DevelopersController : ControllerBase
    {
        private readonly DeveloperContext _context;
        public DevelopersController(DeveloperContext context) => _context = context;

        // GET: api/developers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Developer>>> GetDevelopers()
        {
            var developers = await _context.Developers.ToListAsync();
            return Ok(developers); // JSON array
        }

        // GET: api/developers/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Developer>> GetDeveloper(int id)
        {
            var dev = await _context.Developers.FindAsync(id);
            if (dev == null) return NotFound();
            return Ok(dev); // single JSON object
        }

        // POST: api/developers
        [HttpPost]
        public async Task<ActionResult<Developer>> AddDeveloper(Developer dev)
        {
            _context.Developers.Add(dev);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDeveloper), new { id = dev.DeveloperID }, dev);
        }

        // DELETE: api/developers/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeveloper(int id)
        {
            var dev = await _context.Developers.FindAsync(id);
            if (dev == null) return NotFound();

            _context.Developers.Remove(dev);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
