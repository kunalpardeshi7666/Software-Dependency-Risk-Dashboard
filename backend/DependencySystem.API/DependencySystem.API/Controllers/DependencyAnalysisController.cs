
using DependencySystem.API;
using DependencySystem.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;



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



//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using DependencyRiskDashboard.Common;
//using DependencyRiskDashboard.Extensions;

//namespace DependencyRiskDashboard.Controllers
//{
//    [ApiController]
//    [Route("api/dependencies")]
//    [Authorize] // ✅ secure
//    public class DependencyAnalysisController : ControllerBase
//    {
//        private readonly IGitHubDependencyService _service;

//        public DependencyAnalysisController(IGitHubDependencyService service)
//        {
//            _service = service;
//        }

//        // ✅ Admin/Developer/Tester allowed only if permission granted
//        [HttpPost("analyze")]
//        [Authorize(Policy = "DependencyAnalyze")]
//        public async Task<IActionResult> Analyze([FromBody] RepoUrlRequest request)
//        {
//            if (!ModelState.IsValid)
//                return BadRequest(ModelState);

//            var userId = User.GetUserId();

//            // ✅ role-based filtering / audit logging can be inside service
//            var result = await _service.AnalyzeAsync(request.RepoUrl, userId);

//            return Ok(ApiResponse<DependencyAnalysisResultDto>.Ok(result, "Analysis completed"));
//        }
//    }
//}
