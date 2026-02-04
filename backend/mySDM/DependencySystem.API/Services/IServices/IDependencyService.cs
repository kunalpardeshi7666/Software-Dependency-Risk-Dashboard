using DependencySystem.API.DAL;

namespace DependencySystem.API.Services.IServices
{
    public interface IDependencyService
    {
        Task<bool> HasCircularDependency(int moduleId, int dependsOnModuleId);
        // other methods
    }

}
