using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SDMBackend.DAL;
using SDMBackend.DTOs;
using SDMBackend.Models;

namespace SDMBackend.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🔹 CREATE TASK
        [HttpPost]
        public async Task<IActionResult> Create(TaskDTO dto)
        {
            var task = new TaskEntity
            {
                TaskName = dto.TaskName,
                Status = dto.Status,
                Priority = dto.Priority,
                ModuleID = dto.ModuleID,
                DeveloperID = dto.DeveloperID
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            dto.TaskID = task.TaskID;
            return Ok(dto);
        }

        // 🔹 GET TASK BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var task = await _context.Tasks
                .Where(t => t.TaskID == id)
                .Select(t => new TaskDTO
                {
                    TaskID = t.TaskID,
                    TaskName = t.TaskName,
                    Status = t.Status,
                    Priority = t.Priority,
                    ModuleID = t.ModuleID,
                    DeveloperID = t.DeveloperID
                })
                .FirstOrDefaultAsync();

            if (task == null)
                return NotFound("Task not found");

            return Ok(task);
        }

        // 🔹 GET TASKS BY MODULE ID
        [HttpGet("module/{moduleId}")]
        public async Task<IActionResult> GetByModule(int moduleId)
        {
            var tasks = await _context.Tasks
                .Where(t => t.ModuleID == moduleId)
                .Select(t => new TaskDTO
                {
                    TaskID = t.TaskID,
                    TaskName = t.TaskName,
                    Status = t.Status,
                    Priority = t.Priority,
                    ModuleID = t.ModuleID,
                    DeveloperID = t.DeveloperID
                })
                .ToListAsync();
            return Ok(tasks);
        }

        // 🔹 UPDATE TASK
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TaskDTO dto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
                return NotFound("Task not found");

            // Only update fields if they are provided
            if (!string.IsNullOrEmpty(dto.TaskName))
                task.TaskName = dto.TaskName;

            if (!string.IsNullOrEmpty(dto.Status))
                task.Status = dto.Status;

            if (!string.IsNullOrEmpty(dto.Priority))
                task.Priority = dto.Priority;

            if (dto.ModuleID != 0)
                task.ModuleID = dto.ModuleID;

            if (dto.DeveloperID != 0)
                task.DeveloperID = dto.DeveloperID;

            await _context.SaveChangesAsync();

            dto.TaskID = task.TaskID;
            return Ok(dto);
        }


        // 🔹 DELETE TASK
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
                return NotFound("Task not found");

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Task deleted successfully" });
        }
    }
}
