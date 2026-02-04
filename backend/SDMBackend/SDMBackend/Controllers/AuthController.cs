using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SDMBackend.DAL;
using SDMBackend.DTOs;
using SDMBackend.Models;

namespace SDMBackend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Ping endpoint
        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok("Auth controller is working");
        }

        // Developer registration
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDeveloperDTO dto)
        {
            // Check if email exists
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already exists");

            // Create User (Developer role forced)
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Developer"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Create Developer profile
            var developer = new Developer
            {
                UserID = user.UserID,
                Experience = dto.Experience
            };
            _context.Developers.Add(developer);
            await _context.SaveChangesAsync();

            return Ok(new UserDTO
            {
                UserID = user.UserID,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                DeveloperID = developer.DeveloperID
            });
        }

        // Login endpoint
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var user = await _context.Users
                .Include(u => u.Developer)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return Unauthorized("Invalid email or password");

            bool validPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!validPassword)
                return Unauthorized("Invalid email or password");

            return Ok(new UserDTO
            {
                UserID = user.UserID,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                DeveloperID = user.Developer?.DeveloperID
            });
        }
    }
}
