using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DependencySystem.API.DAL;
using System.Security.Claims;

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
    public IActionResult GetGraph(
        int projectId,
        [FromQuery] string type = "reactflow"
    )
    {
        var role = User.FindFirstValue(ClaimTypes.Role) ?? "Developer";
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        return type.ToLower() switch
        {
            "reactflow" => Ok(GetReactFlowGraph(projectId, role, userId)),
            "d3" => Ok(GetD3Graph(projectId, role, userId)),
            "sankey" => Ok(GetSankeyGraph(projectId, role, userId)),
            _ => BadRequest("Invalid graph type")
        };
    }

    // =====================================================
    // ROLE FILTER: which modules user can see
    // =====================================================
    private IQueryable<Module> GetVisibleModules(int projectId, string role, string? userId)
    {
        var modules = _context.Modules.Where(m => m.ProjectID == projectId);

        // ✅ Admin sees all
        if (role == "Admin")
            return modules;

        // ✅ Developer sees project modules (optional: restrict only assigned ones)
        if (role == "Developer")
        {
            // If you have ModuleAssignment -> filter here
            return modules;
        }

        // ✅ Tester sees only "ReadyForTesting" modules (example)
        if (role == "Tester")
        {
            return modules.Where(m => m.Status.ToString() == "ReadyForTesting");
        }

        return modules;
    }

    // =====================================================
    // REACT FLOW FORMAT
    // =====================================================
    private object GetReactFlowGraph(int projectId, string role, string? userId)
    {
        var visibleModules = GetVisibleModules(projectId, role, userId).ToList();

        var moduleIds = visibleModules.Select(m => m.ModuleID).ToHashSet();

        var nodes = visibleModules.Select(m => new
        {
            id = m.ModuleID.ToString(),
            data = new { label = m.ModuleName },
            position = new { x = 0, y = 0 }
        }).ToList();

        var edges = _context.Dependencies
            .Where(d => moduleIds.Contains(d.SourceModuleID) && moduleIds.Contains(d.TargetModuleID))
            .Select(d => new
            {
                id = $"{d.SourceModuleID}-{d.TargetModuleID}",
                source = d.SourceModuleID.ToString(),
                target = d.TargetModuleID.ToString(),
                animated = true
            })
            .ToList();

        return new { nodes, edges, role };
    }

    // =====================================================
    // D3 FORCE GRAPH FORMAT
    // =====================================================
    private object GetD3Graph(int projectId, string role, string? userId)
    {
        var visibleModules = GetVisibleModules(projectId, role, userId).ToList();
        var moduleIds = visibleModules.Select(m => m.ModuleID).ToHashSet();

        var nodes = visibleModules.Select(m => new
        {
            id = m.ModuleID,
            name = m.ModuleName
        }).ToList();

        var links = _context.Dependencies
            .Where(d => moduleIds.Contains(d.SourceModuleID) && moduleIds.Contains(d.TargetModuleID))
            .Select(d => new
            {
                source = d.SourceModuleID,
                target = d.TargetModuleID,
                value = 1
            })
            .ToList();

        return new { nodes, links, role };
    }

    // =====================================================
    // SANKEY GRAPH FORMAT (✅ Correct Index Mapping)
    // =====================================================
    private object GetSankeyGraph(int projectId, string role, string? userId)
    {
        var visibleModules = GetVisibleModules(projectId, role, userId).ToList();
        var moduleIds = visibleModules.Select(m => m.ModuleID).ToHashSet();

        var nodes = visibleModules
            .Select(m => new { name = m.ModuleName })
            .ToList();

        // ✅ ModuleID -> index mapping for Sankey
        var indexMap = visibleModules
            .Select((m, idx) => new { m.ModuleID, idx })
            .ToDictionary(x => x.ModuleID, x => x.idx);

        var links = _context.Dependencies
            .Where(d => moduleIds.Contains(d.SourceModuleID) && moduleIds.Contains(d.TargetModuleID))
            .Select(d => new
            {
                source = indexMap[d.SourceModuleID],
                target = indexMap[d.TargetModuleID],
                value = 1
            })
            .ToList();

        return new { nodes, links, role };
    }
}
