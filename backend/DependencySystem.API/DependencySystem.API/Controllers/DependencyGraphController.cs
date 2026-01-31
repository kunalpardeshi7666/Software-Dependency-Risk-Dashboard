using Microsoft.AspNetCore.Mvc;
using DependencySystem.API.DAL;
[ApiController]
[Route("api/dependency-graph")]
public class DependencyGraphController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DependencyGraphController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("{projectId}")]
    public IActionResult GetGraph(int projectId)
    {
        var modules = _context.Modules
            .Where(m => m.ProjectID == projectId)
            .Select(m => new { id = m.ModuleID, label = m.ModuleName })
            .ToList();

        var edges = _context.Dependencies
     .Join(
         _context.Modules,
         d => d.ModuleID,
         m => m.ModuleID,
         (d, m) => new { d, m }
     )
     .Where(x => x.m.ProjectID == projectId)
     .Select(x => new
     {
         from = x.d.ModuleID,
         to = x.d.DependsOnModuleID
     })
     .ToList();


        return Ok(new { nodes = modules, edges });
    }




}
