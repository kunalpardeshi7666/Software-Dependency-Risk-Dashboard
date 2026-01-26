using DependencyRiskDashboard.Models;

namespace DependencyRiskDashboard.Services.Interfaces
{
    public interface IGitHubAnalysisService
    {
        Task<RepoAnalysisResult> AnalyzeRepositoryAsync(
            string owner,
            string repo,
            string branch = "main");
    }

}
