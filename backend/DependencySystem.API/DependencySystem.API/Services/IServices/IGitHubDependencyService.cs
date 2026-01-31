using DependencySystem.API.DTOs;

namespace DependencySystem.API.Services.IServices
{
    public interface IGitHubDependencyService
    {
        Task<DependencyAnalysisResultDto> AnalyzeAsync(string repoUrl, string userId);
    }

}
