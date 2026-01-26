using DependencyRiskDashboard.Models;
using DependencyRiskDashboard.Services;
using DependencyRiskDashboard.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
namespace DependencyRiskDashboard.Controllers
{
   

    [ApiController]
[Route("api/repository")]
public class RepositoryAnalysisController : ControllerBase
{
    private readonly GitHubAnalysisService _service;

    public RepositoryAnalysisController(GitHubAnalysisService service)
    {
        _service = service;
    }

    [HttpPost("analyze-url")]
    public async Task<IActionResult> AnalyzeByUrl(
        [FromBody] RepoUrlRequest request)
    {
        var result = await _service.AnalyzeByUrlAsync(request.RepoUrl);
        return Ok(result);
    }
}


}
