using DependencySystem.API.DTOs.Team;
using DependencySystem.API.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DependencySystem.API.Controllers
{
    [Route("api/team")]
    [ApiController]
    [Authorize]
    public class TeamController : ControllerBase
    {
        private readonly ITeamService _teamService;

        public TeamController(ITeamService teamService)
        {
            _teamService = teamService;
        }

        private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier);

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _teamService.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetById(string userId)
        {
            var data = await _teamService.GetByIdAsync(userId);
            return Ok(data);
        }

        // ✅ Add team member (Admin/Developer)
        [HttpPost]
        [Authorize(Roles = "Admin,Developer")]
        public async Task<IActionResult> Create([FromBody] CreateTeamMemberDto dto)
        {
            var data = await _teamService.CreateAsync(dto);
            return Ok(data);
        }

        // ✅ Update profile (Admin OR same user)
        [HttpPut("{userId}/profile")]
        public async Task<IActionResult> UpdateProfile(string userId, [FromBody] UpdateTeamMemberProfileDto dto)
        {
            var isAdmin = User.IsInRole("Admin");
            var data = await _teamService.UpdateProfileAsync(userId, dto, CurrentUserId, isAdmin);
            return Ok(data);
        }

        // ✅ Reset password (Admin only)
        [HttpPost("{userId}/reset-password")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResetPassword(string userId, [FromBody] ResetPasswordDto dto)
        {
            var ok = await _teamService.ResetPasswordAsync(userId, dto);
            return Ok(new { success = ok });
        }

        // ✅ Delete member (Admin only)
        [HttpDelete("{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(string userId)
        {
            var ok = await _teamService.DeleteAsync(userId);
            return Ok(new { success = ok });
        }
    }
}
