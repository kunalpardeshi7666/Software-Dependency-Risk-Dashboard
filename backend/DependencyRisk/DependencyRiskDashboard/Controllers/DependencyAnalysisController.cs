using DependencyRiskDashboard.Models;
using DependencyRiskDashboard.Services;
using Microsoft.AspNetCore.Mvc;
namespace DependencyRiskDashboard.Controllers
{
   

    [ApiController]
    [Route("api/dependencies")]
    public class DependencyAnalysisController : ControllerBase
    {
        private readonly GitHubDependencyService _service;

        public DependencyAnalysisController(GitHubDependencyService service)
        {
            _service = service;
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> Analyze(
            [FromBody] RepoUrlRequest request)
        {
            var result = await _service.AnalyzeAsync(request.RepoUrl);
            return Ok(result);
        }
    }

}
