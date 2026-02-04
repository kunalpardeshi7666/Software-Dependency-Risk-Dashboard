using DependencySystem.API.DAL;
using DependencySystem.API.DTOs.Team;
using DependencySystem.API.Model;
using DependencySystem.API.Services.IServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DependencySystem.API.Services
{
    public class TeamService : ITeamService
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public TeamService(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        public async Task<TeamMemberDto> CreateAsync(CreateTeamMemberDto dto)
        {
            var existing = await _userManager.FindByEmailAsync(dto.Email);
            if (existing != null) throw new Exception("User already exists");

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email
            };

            var password = string.IsNullOrWhiteSpace(dto.Password) ? "User@123" : dto.Password;

            var res = await _userManager.CreateAsync(user, password);
            if (!res.Succeeded) throw new Exception(res.Errors.FirstOrDefault()?.Description ?? "Failed to create user");

            await _userManager.AddToRoleAsync(user, dto.Role);

            // ✅ Create profile row
            var profile = new TeamMemberProfile
            {
                UserID = user.Id,
                FullName = dto.FullName ?? "",
                JoinDate = DateTime.UtcNow
            };

            _db.TeamMemberProfiles.Add(profile);
            await _db.SaveChangesAsync();

            return await GetByIdAsync(user.Id);
        }

        public async Task<List<TeamMemberDto>> GetAllAsync()
        {
            var users = await _db.Users.ToListAsync();

            var profiles = await _db.TeamMemberProfiles.ToListAsync();

            var profileMap = profiles.ToDictionary(x => x.UserID, x => x);

            var result = new List<TeamMemberDto>();

            foreach (var u in users)
            {
                var roles = await _userManager.GetRolesAsync(u);
                var role = roles.FirstOrDefault() ?? "Unknown";

                profileMap.TryGetValue(u.Id, out var p);

                result.Add(new TeamMemberDto
                {
                    UserID = u.Id,
                    Email = u.Email,
                    Role = role,

                    FullName = p?.FullName,
                    MobileNumber = p?.MobileNumber,
                    Age = p?.Age,
                    ExperienceYears = p?.ExperienceYears,
                    TechnicalSkills = p?.TechnicalSkills,
                    SelfIntroduction = p?.SelfIntroduction,
                    JoinDate = p?.JoinDate
                });
            }

            return result;
        }

        public async Task<TeamMemberDto> GetByIdAsync(string userId)
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null) throw new Exception("User not found");

            var profile = await _db.TeamMemberProfiles.FirstOrDefaultAsync(x => x.UserID == userId);

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "Unknown";

            return new TeamMemberDto
            {
                UserID = user.Id,
                Email = user.Email,
                Role = role,

                FullName = profile?.FullName,
                MobileNumber = profile?.MobileNumber,
                Age = profile?.Age,
                ExperienceYears = profile?.ExperienceYears,
                TechnicalSkills = profile?.TechnicalSkills,
                SelfIntroduction = profile?.SelfIntroduction,
                JoinDate = profile?.JoinDate
            };
        }

        public async Task<TeamMemberDto> UpdateProfileAsync(string userId, UpdateTeamMemberProfileDto dto, string currentUserId, bool isAdmin)
        {
            // ✅ Only Admin OR Self can edit
            if (!isAdmin && currentUserId != userId)
                throw new Exception("You can update only your own profile");

            var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null) throw new Exception("User not found");

            var profile = await _db.TeamMemberProfiles.FirstOrDefaultAsync(x => x.UserID == userId);

            // ✅ Auto create profile if missing
            if (profile == null)
            {
                profile = new TeamMemberProfile { UserID = userId };
                _db.TeamMemberProfiles.Add(profile);
            }

            profile.FullName = dto.FullName ?? profile.FullName;
            profile.MobileNumber = dto.MobileNumber ?? profile.MobileNumber;
            profile.Age = dto.Age;
            profile.ExperienceYears = dto.ExperienceYears;
            profile.TechnicalSkills = dto.TechnicalSkills ?? profile.TechnicalSkills;
            profile.SelfIntroduction = dto.SelfIntroduction ?? profile.SelfIntroduction;
            profile.JoinDate = dto.JoinDate;
            profile.UpdatedAt = DateTime.UtcNow;

            // ✅ Admin only role update
            if (isAdmin && !string.IsNullOrWhiteSpace(dto.Role))
            {
                var currentRoles = await _userManager.GetRolesAsync(user);
                if (currentRoles.Any())
                    await _userManager.RemoveFromRolesAsync(user, currentRoles);

                await _userManager.AddToRoleAsync(user, dto.Role);
            }

            await _db.SaveChangesAsync();

            return await GetByIdAsync(userId);
        }

        public async Task<bool> ResetPasswordAsync(string userId, ResetPasswordDto dto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var res = await _userManager.ResetPasswordAsync(user, token, dto.NewPassword);

            if (!res.Succeeded)
                throw new Exception(res.Errors.FirstOrDefault()?.Description ?? "Reset password failed");

            return true;
        }

        public async Task<bool> DeleteAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            var res = await _userManager.DeleteAsync(user);

            if (!res.Succeeded)
                throw new Exception(res.Errors.FirstOrDefault()?.Description ?? "Delete failed");

            return true;
        }
    }
}
