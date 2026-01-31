//using DependencySystem.API.DAL;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Text.Json;

//    [ApiController]
//    [Route("api/dependencies/history")]
//    [Authorize]
//    public class DependencyAnalysisHistoryController : ControllerBase
//    {
//        private readonly ApplicationDbContext _db;

//        public DependencyAnalysisHistoryController(ApplicationDbContext db)
//        {
//            _db = db;
//        }

//        // ✅ List history
//        [HttpGet]
//        [Authorize(Policy = "DependencyHistoryView")]
//        public async Task<IActionResult> GetMyHistory()
//        {
//            var userId = User.GetUserId();
//            var isAdmin = User.IsInRole("Admin");

//            var query = _db.DependencyAnalysisRuns.AsQueryable();

//            // ✅ Admin sees all, others only own history
//            if (!isAdmin)
//                query = query.Where(x => x.CreatedByUserId == userId);

//            var list = await query
//                .OrderByDescending(x => x.AnalyzedAt)
//                .Select(x => new DependencyAnalysisHistoryListDto
//                {
//                    RunId = x.RunId,
//                    RepoUrl = x.RepoUrl,
//                    AnalyzedAt = x.AnalyzedAt,
//                    TotalPackages = x.TotalPackages,
//                    OutdatedPackages = x.OutdatedPackages,
//                    VulnerablePackages = x.VulnerablePackages,
//                    RiskScore = x.RiskScore
//                })
//                .ToListAsync();

//            return Ok(ApiResponse<IEnumerable<DependencyAnalysisHistoryListDto>>.Ok(list));
//        }

//        // ✅ Details of a run
//        [HttpGet("{runId}")]
//        [Authorize(Policy = "DependencyHistoryView")]
//        public async Task<IActionResult> GetDetails(Guid runId)
//        {
//            var userId = User.GetUserId();
//            var isAdmin = User.IsInRole("Admin");

//            var run = await _db.DependencyAnalysisRuns.FirstOrDefaultAsync(x => x.RunId == runId);

//            if (run == null)
//                return NotFound(ApiResponse<string>.Fail("Run not found"));

//            if (!isAdmin && run.CreatedByUserId != userId)
//                return Forbid();

//            var parsed = JsonSerializer.Deserialize<DependencyAnalysisResultDto>(run.ResultJson);

//            var dto = new DependencyAnalysisHistoryDetailsDto
//            {
//                RunId = run.RunId,
//                RepoUrl = run.RepoUrl,
//                AnalyzedAt = run.AnalyzedAt,
//                TotalPackages = run.TotalPackages,
//                OutdatedPackages = run.OutdatedPackages,
//                VulnerablePackages = run.VulnerablePackages,
//                RiskScore = run.RiskScore,
//                Result = parsed ?? new DependencyAnalysisResultDto()
//            };

//            return Ok(ApiResponse<DependencyAnalysisHistoryDetailsDto>.Ok(dto));
//        }

//        // ✅ Admin can delete history run (optional)
//        [HttpDelete("{runId}")]
//        [Authorize(Roles = "Admin")]
//        public async Task<IActionResult> DeleteRun(Guid runId)
//        {
//            var run = await _db.DependencyAnalysisRuns.FirstOrDefaultAsync(x => x.RunId == runId);
//            if (run == null)
//                return NotFound(ApiResponse<string>.Fail("Run not found"));

//            _db.DependencyAnalysisRuns.Remove(run);
//            await _db.SaveChangesAsync();

//            return Ok(ApiResponse<string>.Ok(null, "Run deleted"));
//        }
//    }
