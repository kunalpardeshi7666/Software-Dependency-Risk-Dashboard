using DependencySystem.API.DTOs.ProjectTeam;

namespace DependencySystem.API.Services.IServices
{
    public interface IProjectTeamService
    {
        Task<List<ProjectTeamMemberDto>> GetProjectTeamAsync(int projectId);
        Task<ProjectTeamMemberDto> AssignMemberAsync(int projectId, AssignProjectTeamMemberDto dto);
        Task<bool> RemoveMemberAsync(int projectId, string userId);
    }
}
