using DependencyRiskDashboard.Models;
using DependencyRiskDashboard.Services.Interfaces;
using Newtonsoft.Json.Linq;
using System.Net.Http;

namespace DependencyRiskDashboard.Services
{
    using Newtonsoft.Json.Linq;

    public class GitHubAnalysisService
    {
        private readonly HttpClient _client;

        public GitHubAnalysisService(HttpClient client)
        {
            _client = client;
            _client.DefaultRequestHeaders.Add("User-Agent", "Repo-Analyzer");
        }

        public async Task<RepoAnalysisResult> AnalyzeByUrlAsync(string repoUrl)
        {
            var (owner, repo) = ParseGitHubUrl(repoUrl);

            // Get default branch SHA
            var repoInfo = await _client.GetStringAsync(
                $"https://api.github.com/repos/{owner}/{repo}");

            var branch = JObject.Parse(repoInfo)["default_branch"]!.ToString();

            var branchInfo = await _client.GetStringAsync(
                $"https://api.github.com/repos/{owner}/{repo}/branches/{branch}");

            var sha = JObject.Parse(branchInfo)["commit"]["sha"]!.ToString();

            // Get recursive tree
            var treeJson = await _client.GetStringAsync(
                $"https://api.github.com/repos/{owner}/{repo}/git/trees/{sha}?recursive=1");

            var tree = JObject.Parse(treeJson)["tree"] as JArray;

            int files = 0;
            int folders = 0;

            foreach (var item in tree!)
            {
                if (item["type"]!.ToString() == "blob")
                    files++;
                else if (item["type"]!.ToString() == "tree")
                    folders++;
            }

            return new RepoAnalysisResult
            {
                TotalFiles = files,
                TotalFolders = folders,
                SubFolders = folders - 1
            };
        }

        // ✅ URL parsing logic belongs here
        private (string owner, string repo) ExtractOwnerRepo(string repoUrl)
        {
            if (!Uri.TryCreate(repoUrl, UriKind.Absolute, out var uri))
                throw new ArgumentException("Invalid GitHub URL");

            var segments = uri.AbsolutePath
                .Trim('/')
                .Split('/', StringSplitOptions.RemoveEmptyEntries);

            if (segments.Length < 2)
                throw new ArgumentException("Invalid GitHub repository URL");

            return (segments[0], segments[1]);
        }
        private (string owner, string repo) ParseGitHubUrl(string url)
        {
            var uri = new Uri(url);
            var parts = uri.AbsolutePath.Trim('/').Split('/');
            return (parts[0], parts[1]);
        }
    }


}
