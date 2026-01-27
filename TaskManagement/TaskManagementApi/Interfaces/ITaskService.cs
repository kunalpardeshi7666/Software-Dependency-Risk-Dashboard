using TaskManagementApi.DTOs;

namespace TaskManagementApi.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskDTO>> GetAllAsync();
        Task<TaskDTO?> GetByIdAsync(int id);
        Task CreateAsync(TaskDTO dto);
        Task UpdateAsync(int id, TaskDTO dto);
        Task DeleteAsync(int id);
    }
}
