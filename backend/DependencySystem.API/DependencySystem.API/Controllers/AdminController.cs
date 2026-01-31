using DependencySystem.API.DTOs.Admin;
using DependencySystem.API.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace DependencySystem.API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")] // ✅ Only Admin can access
    public class AdminController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        // =====================================================
        // ✅ ADMIN REGISTER (Create any user with role)
        // =====================================================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AdminRegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var existingUser = await _userManager.FindByEmailAsync(request.Email);
                if (existingUser != null)
                    return Conflict(new { message = "User already exists" });

                var allowedRoles = new[] { "Admin", "Developer", "ReadOnly" };
                if (!allowedRoles.Contains(request.Role))
                    return BadRequest(new { message = "Invalid role. Allowed: Admin, Developer, ReadOnly" });

                var user = new ApplicationUser
                {
                    UserName = request.Email,
                    Email = request.Email,
                    PhoneNumber = request.MobileNumber,
                    EmailConfirmed = true,
                    IsActive = request.IsActive,
                    FirstName = request.FullName,
                    LastName = ""
                };

                var result = await _userManager.CreateAsync(user, request.Password);
                if (!result.Succeeded)
                    return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });

                var roleResult = await _userManager.AddToRoleAsync(user, request.Role);
                if (!roleResult.Succeeded)
                    return BadRequest(new { message = string.Join(", ", roleResult.Errors.Select(e => e.Description)) });

                return Ok(new
                {
                    message = "User created successfully",
                    email = user.Email,
                    role = request.Role,
                    isActive = user.IsActive
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong", error = ex.Message });
            }
        }


        // =====================================================
        // ✅ CHANGE ROLE (Admin only)
        // =====================================================
        [HttpPut("change-role")]
        public async Task<IActionResult> ChangeRole([FromBody] ChangeUserRoleRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Validation failed", errors = ModelState });

            try
            {
                var user = await _userManager.FindByEmailAsync(request.Email);
                if (user == null)
                    return NotFound(new { message = "User not found" });

                var allowedRoles = new[] { "Admin", "Developer", "ReadOnly" };
                if (!allowedRoles.Contains(request.NewRole))
                    return BadRequest(new { message = "Invalid role. Allowed: Admin, Developer, ReadOnly" });

                var currentRoles = await _userManager.GetRolesAsync(user);

                // ✅ Remove old roles
                if (currentRoles.Any())
                {
                    var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                    if (!removeResult.Succeeded)
                        return BadRequest(new { message = string.Join(", ", removeResult.Errors.Select(e => e.Description)) });
                }

                // ✅ Add new role
                var addRoleResult = await _userManager.AddToRoleAsync(user, request.NewRole);
                if (!addRoleResult.Succeeded)
                    return BadRequest(new { message = string.Join(", ", addRoleResult.Errors.Select(e => e.Description)) });

                return Ok(new
                {
                    message = "Role updated successfully",
                    email = user.Email,
                    newRole = request.NewRole
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong", error = ex.Message });
            }
        }

        // =====================================================
        // ✅ GET ALL USERS (Admin only)
        // =====================================================
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = _userManager.Users.ToList();

                var result = new List<object>();

                foreach (var user in users)
                {
                    var roles = await _userManager.GetRolesAsync(user);

                    result.Add(new
                    {
                        user.Id,
                        user.Email,
                        Roles = roles,
                        user.PhoneNumber,
                        user.EmailConfirmed,
                        user.IsActive
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong", error = ex.Message });
            }
        }

        // =====================================================
        // ✅ ENABLE / DISABLE USER (Admin only)
        // =====================================================
        [HttpPut("set-active")]
        public async Task<IActionResult> SetUserActive([FromBody] SetUserActiveRequest request)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(request.Email);
                if (user == null)
                    return NotFound(new { message = "User not found" });

                user.IsActive = request.IsActive;

                var update = await _userManager.UpdateAsync(user);
                if (!update.Succeeded)
                    return BadRequest(new { message = string.Join(", ", update.Errors.Select(e => e.Description)) });

                return Ok(new
                {
                    message = "User status updated successfully",
                    email = user.Email,
                    isActive = user.IsActive
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong", error = ex.Message });
            }
        }
    }
}
