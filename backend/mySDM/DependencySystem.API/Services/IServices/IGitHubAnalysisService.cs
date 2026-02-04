using DependencySystem.API.Model;

namespace DependencySystem.API.Services.IServices
{
    public interface IGitHubAnalysisService
    {
        Task<RepoAnalysisResult> AnalyzeRepositoryAsync(
            string owner,
            string repo,
            string branch = "main");
    }

}
