using DependencySystem.API.DAL;
using DependencySystem.API.DTOs.ProjectTeam;
using DependencySystem.API.Model;
using DependencySystem.API.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace DependencySystem.API.Services
{
    public class ProjectTeamService : IProjectTeamService
    {
        private readonly ApplicationDbContext _db;

        public ProjectTeamService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<List<ProjectTeamMemberDto>> GetProjectTeamAsync(int projectId)
        {
            var exists = await _db.Projects.AnyAsync(p => p.ProjectID == projectId);
            if (!exists) throw new Exception("Project not found");

            var team = await _db.ProjectTeamMembers
                .Where(x => x.ProjectID == projectId)
                .Include(x => x.User)
                .OrderByDescending(x => x.AssignedAt)
                .Select(x => new ProjectTeamMemberDto
                {
                    ProjectID = x.ProjectID,
                    UserID = x.UserID,
                    Email = x.User.Email,
                    FullName = x.User.UserName, // ✅ update if you store profile full name separately
                    TeamRole = x.Role,
                    AssignedAt = x.AssignedAt
                })
                .ToListAsync();

            return team;
        }

        public async Task<ProjectTeamMemberDto> AssignMemberAsync(int projectId, AssignProjectTeamMemberDto dto)
        {
            var project = await _db.Projects.FirstOrDefaultAsync(p => p.ProjectID == projectId);
            if (project == null) throw new Exception("Project not found");

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == dto.UserID);
            if (user == null) throw new Exception("User not found");

            var already = await _db.ProjectTeamMembers
                .AnyAsync(x => x.ProjectID == projectId && x.UserID == dto.UserID);

            if (already) throw new Exception("Member already assigned to this project");

            var entity = new ProjectTeamMember
            {
                ProjectID = projectId,
                UserID = dto.UserID,
                Role = string.IsNullOrWhiteSpace(dto.TeamRole) ? "Member" : dto.TeamRole,
                AssignedAt = DateTime.UtcNow
            };

            _db.ProjectTeamMembers.Add(entity);
            await _db.SaveChangesAsync();

            return new ProjectTeamMemberDto
            {
                ProjectID = projectId,
                UserID = dto.UserID,
                Email = user.Email,
                FullName = user.UserName,
                TeamRole = entity.Role,
                AssignedAt = entity.AssignedAt
            };
        }

        public async Task<bool> RemoveMemberAsync(int projectId, string userId)
        {
            var row = await _db.ProjectTeamMembers
                .FirstOrDefaultAsync(x => x.ProjectID == projectId && x.UserID == userId);

            if (row == null) throw new Exception("Member not assigned to this project");

            _db.ProjectTeamMembers.Remove(row);
            await _db.SaveChangesAsync();

            return true;
        }
    }
}
