using DependencySystem.API.DTOs;

namespace DependencySystem.API.Services.IServices
{
    public interface IDependencyScanService
    {
        Task<Guid> CreateScanAsync(CreateScanRunDto dto, string userId);

        Task<IEnumerable<ScanRunSummaryDto>> GetProjectScansAsync(Guid projectId, string userId);

        Task<object> GetScanDetailsAsync(Guid scanRunId, string userId);

        Task<object> GetOutdatedPackagesAsync(Guid scanRunId, string userId);

        Task<object> GetVulnerablePackagesAsync(Guid scanRunId, string userId);

        Task<DependencyGraphDto> GetGraphAsync(Guid scanRunId, string userId);
    }

}
