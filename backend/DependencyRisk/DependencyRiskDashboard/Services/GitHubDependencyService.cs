using DependencyRiskDashboard.Models;
using Newtonsoft.Json.Linq;
using System.Text;

namespace DependencyRiskDashboard.Services
{
  

    public class GitHubDependencyService
    {
        private readonly HttpClient _client;

        public GitHubDependencyService(HttpClient client)
        {
            _client = client;
            _client.BaseAddress = new Uri("https://api.github.com");
            _client.DefaultRequestHeaders.Add("User-Agent", "Dependency-Analyzer");
        }

        // ENTRY METHOD
        public async Task<DependencyAnalysisResponse> AnalyzeAsync(string repoUrl)
        {
            var (owner, repo) = ExtractOwnerRepo(repoUrl);

            var dependencyFilePath = await DetectDependencyFile(owner, repo);

            if (dependencyFilePath == null)
            {
                return new DependencyAnalysisResponse
                {
                    FileType = "None",
                    Data = "No dependency file found"
                };
            }

            var content = await ReadFile(owner, repo, dependencyFilePath);

            if (dependencyFilePath.EndsWith("package.json"))
            {
                return new DependencyAnalysisResponse
                {
                    FileType = "package.json",
                    Data = ParsePackageJson(content)
                };
            }

            if (dependencyFilePath.EndsWith("pom.xml"))
            {
                return new DependencyAnalysisResponse
                {
                    FileType = "pom.xml",
                    Data = "pom.xml detected (parser pending)"
                };
            }

            return new DependencyAnalysisResponse
            {
                FileType = "csproj",
                Data = "csproj detected (parser pending)"
            };
        }

        // ---------------- HELPER METHODS ----------------

        private (string owner, string repo) ExtractOwnerRepo(string url)
        {
            var uri = new Uri(url);
            var parts = uri.AbsolutePath.Trim('/').Split('/');
            return (parts[0], parts[1]);
        }

        private async Task<string?> DetectDependencyFile(string owner, string repo)
        {
            var repoInfo = JObject.Parse(
                await _client.GetStringAsync($"/repos/{owner}/{repo}")
            );

            var branch = repoInfo["default_branch"]!.ToString();

            var branchInfo = JObject.Parse(
                await _client.GetStringAsync(
                    $"/repos/{owner}/{repo}/branches/{branch}")
            );

            var sha = branchInfo["commit"]!["sha"]!.ToString();

            var treeJson = JObject.Parse(
                await _client.GetStringAsync(
                    $"/repos/{owner}/{repo}/git/trees/{sha}?recursive=1")
            );

            foreach (var item in treeJson["tree"]!)
            {
                var path = item["path"]!.ToString();

                if (path.EndsWith("package.json")) return path;
                if (path.EndsWith("pom.xml")) return path;
                if (path.EndsWith(".csproj")) return path;
            }

            return null;
        }

        private async Task<string> ReadFile(
            string owner,
            string repo,
            string path)
        {
            var json = JObject.Parse(
                await _client.GetStringAsync(
                    $"/repos/{owner}/{repo}/contents/{path}")
            );

            var base64 = json["content"]!.ToString();
            return Encoding.UTF8.GetString(
                Convert.FromBase64String(base64));
        }

        private PackageJsonResult ParsePackageJson(string content)
        {
            var json = JObject.Parse(content);

            return new PackageJsonResult
            {
                Name = json["name"]?.ToString() ?? "",
                Version = json["version"]?.ToString() ?? "",
                Dependencies = json["dependencies"]?
                    .ToObject<Dictionary<string, string>>() ?? new()
            };
        }
    }

}
