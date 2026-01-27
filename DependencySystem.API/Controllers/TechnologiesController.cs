using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/technologies")]
public class TechnologiesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TechnologiesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create(Technology tech)
    {
        _context.Technologies.Add(tech);
        await _context.SaveChangesAsync();
        return Ok(tech);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _context.Technologies.ToListAsync());
    }
}
