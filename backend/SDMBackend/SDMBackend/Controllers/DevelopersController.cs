using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SDMBackend.DAL;
using SDMBackend.DTOs;
using SDMBackend.Models;

namespace SDMBackend.Controllers
{
    [ApiController]
    [Route("api/developers")]
    public class DevelopersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DevelopersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var devs = await _context.Developers
                .Include(d => d.User)
                .Select(d => new DeveloperDTO
                {
                    DeveloperID = d.DeveloperID,
                    UserID = d.UserID,
                    Name = d.User!.Name,
                    Email = d.User.Email,
                    Role = d.User.Role,
                    Experience = d.Experience
                })
                .ToListAsync();

            return Ok(devs);
        }


        [HttpPost]
        public async Task<IActionResult> Create(DeveloperDTO dto)
        {
            // create user
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Role = "Developer",
                PasswordHash = "TEMP_HASH" // later replace with real hashing
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // create developer profile
            var dev = new Developer
            {
                UserID = user.UserID,
                Experience = dto.Experience
            };

            _context.Developers.Add(dev);
            await _context.SaveChangesAsync();

            dto.DeveloperID = dev.DeveloperID;
            dto.UserID = user.UserID;

            return Ok(dto);
        }

    }

}
