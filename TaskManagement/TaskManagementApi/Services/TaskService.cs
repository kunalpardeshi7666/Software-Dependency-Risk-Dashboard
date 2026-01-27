using TaskManagementApi.DTOs;
using TaskManagementApi.Interfaces;
using TaskManagementApi.Models;

namespace TaskManagementApi.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _repo;

        public TaskService(ITaskRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<TaskDTO>> GetAllAsync()
        {
            var tasks = await _repo.GetAllAsync();
            return tasks.Select(t => new TaskDTO
            {
                TaskID = t.TaskID,
                TaskName = t.TaskName,
                Status = t.Status,
                Priority = t.Priority,
                ModuleID = t.ModuleID,
                DeveloperID = t.DeveloperID
            });
        }

        public async Task<TaskDTO?> GetByIdAsync(int id)
        {
            var task = await _repo.GetByIdAsync(id);
            if (task == null) return null;

            return new TaskDTO
            {
                TaskID = task.TaskID,
                TaskName = task.TaskName,
                Status = task.Status,
                Priority = task.Priority,
                ModuleID = task.ModuleID,
                DeveloperID = task.DeveloperID
            };
        }

        public async Task CreateAsync(TaskDTO dto)
        {
            var task = new TaskItem
            {
                TaskName = dto.TaskName,
                Status = dto.Status,
                Priority = dto.Priority,
                ModuleID = dto.ModuleID,
                DeveloperID = dto.DeveloperID
            };

            await _repo.AddAsync(task);
        }

        public async Task UpdateAsync(int id, TaskDTO dto)
        {
            var task = await _repo.GetByIdAsync(id);
            if (task == null) return;

            task.TaskName = dto.TaskName;
            task.Status = dto.Status;
            task.Priority = dto.Priority;
            task.ModuleID = dto.ModuleID;
            task.DeveloperID = dto.DeveloperID;

            await _repo.UpdateAsync(task);
        }

        public async Task DeleteAsync(int id)
        {
            await _repo.DeleteAsync(id);
        }
    }
}

