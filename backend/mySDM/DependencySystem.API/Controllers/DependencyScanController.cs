
//using DependencySystem.API.DTOs;
//using DependencySystem.API.DTOs.Auth.Common;
//using DependencySystem.API.Services.IServices;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;





//[ApiController]
//[Route("api/dependency-scans")]
//[Authorize]
//public class DependencyScanController : ControllerBase
//{
//    private readonly IDependencyScanService _scanService;

//    public DependencyScanController(IDependencyScanService scanService)
//    {
//        _scanService = scanService;
//    }

//    // ✅ 1) Create scan (Tester runs scan OR developer uploads SBOM)
//    [HttpPost]
//    [Authorize(Policy = "DependencyScanCreate")]
//    public async Task<IActionResult> CreateScan([FromBody] CreateScanRunDto dto)
//    {
//        var userId = User.GetUserId();
//        var scanRunId = await _scanService.CreateScanAsync(dto, userId);

//        return Ok(ApiResponse<Guid>.Ok(scanRunId, "Scan uploaded successfully"));
//    }

//    // ✅ 2) List scans per project (Admin sees all, others only allowed)
//    [HttpGet("project/{projectId}")]
//    [Authorize(Policy = "DependencyScanView")]
//    public async Task<IActionResult> GetProjectScans(Guid projectId)
//    {
//        var userId = User.GetUserId();
//        var scans = await _scanService.GetProjectScansAsync(projectId, userId);

//        return Ok(ApiResponse<IEnumerable<ScanRunSummaryDto>>.Ok(scans));
//    }

//    // ✅ 3) Get scan details
//    [HttpGet("{scanRunId}")]
//    [Authorize(Policy = "DependencyScanView")]
//    public async Task<IActionResult> GetScanDetails(Guid scanRunId)
//    {
//        var userId = User.GetUserId();
//        var details = await _scanService.GetScanDetailsAsync(scanRunId, userId);

//        return Ok(ApiResponse<object>.Ok(details));
//    }

//    // ✅ 4) Outdated packages for scan run
//    [HttpGet("{scanRunId}/outdated")]
//    [Authorize(Policy = "DependencyScanView")]
//    public async Task<IActionResult> GetOutdated(Guid scanRunId)
//    {
//        var userId = User.GetUserId();
//        var list = await _scanService.GetOutdatedPackagesAsync(scanRunId, userId);

//        return Ok(ApiResponse<object>.Ok(list));
//    }

//    // ✅ 5) Vulnerabilities for scan run
//    [HttpGet("{scanRunId}/vulnerabilities")]
//    [Authorize(Policy = "DependencyScanView")]
//    public async Task<IActionResult> GetVulnerabilities(Guid scanRunId)
//    {
//        var userId = User.GetUserId();
//        var list = await _scanService.GetVulnerablePackagesAsync(scanRunId, userId);

//        return Ok(ApiResponse<object>.Ok(list));
//    }

//    // ✅ 6) Dependency Graph for scan run
//    [HttpGet("{scanRunId}/graph")]
//    [Authorize(Policy = "DependencyGraphView")]
//    public async Task<IActionResult> GetGraph(Guid scanRunId)
//    {
//        var userId = User.GetUserId();
//        var graph = await _scanService.GetGraphAsync(scanRunId, userId);

//        return Ok(ApiResponse<DependencyGraphDto>.Ok(graph));
//    }
//}
//    }

