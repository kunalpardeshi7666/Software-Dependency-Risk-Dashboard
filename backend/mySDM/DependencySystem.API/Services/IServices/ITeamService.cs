using DependencySystem.API.DTOs.Team;

namespace DependencySystem.API.Services.IServices
{
    public interface ITeamService
    {
        Task<TeamMemberDto> CreateAsync(CreateTeamMemberDto dto);
        Task<List<TeamMemberDto>> GetAllAsync();
        Task<TeamMemberDto> GetByIdAsync(string userId);

        Task<TeamMemberDto> UpdateProfileAsync(string userId, UpdateTeamMemberProfileDto dto, string currentUserId, bool isAdmin);

        Task<bool> ResetPasswordAsync(string userId, ResetPasswordDto dto);

        Task<bool> DeleteAsync(string userId);
    }
}
