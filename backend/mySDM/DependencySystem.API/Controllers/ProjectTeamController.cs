using DependencySystem.API.DTOs.ProjectTeam;
using DependencySystem.API.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DependencySystem.API.Controllers
{
    [Route("api/projects/{projectId}/team")]
    [ApiController]
    [Authorize]
    public class ProjectTeamController : ControllerBase
    {
        private readonly IProjectTeamService _service;

        public ProjectTeamController(IProjectTeamService service)
        {
            _service = service;
        }

        // ✅ GET: /api/projects/{projectId}/team
        [HttpGet]
        public async Task<IActionResult> GetProjectTeam(int projectId)
        {
            var team = await _service.GetProjectTeamAsync(projectId);
            return Ok(team);
        }

        // ✅ POST: /api/projects/{projectId}/team
        [HttpPost]
        [Authorize(Roles = "Admin,Developer")]
        public async Task<IActionResult> AssignMember(int projectId, [FromBody] AssignProjectTeamMemberDto dto)
        {
            var result = await _service.AssignMemberAsync(projectId, dto);
            return Ok(result);
        }

        // ✅ DELETE: /api/projects/{projectId}/team/{userId}
        [HttpDelete("{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveMember(int projectId, string userId)
        {
            var ok = await _service.RemoveMemberAsync(projectId, userId);
            return Ok(new { success = ok });
        }
    }
}
