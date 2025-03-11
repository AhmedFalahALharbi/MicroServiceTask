using Microsoft.EntityFrameworkCore;
using TaskMicroservice.Data;
using TaskMicroservice.Models;
using Task = TaskMicroservice.Models.Task;

namespace TaskMicroservice.Services
{
    public class TaskService
    {
        private readonly TaskDbContext _context;

        public TaskService(TaskDbContext context)
        {
            _context = context;
        }

        public List<Task> GetAll() => _context.Tasks.ToList();

        public Task GetById(int id) => _context.Tasks.Find(id);

        public Task Create(Task task)
        {
            _context.Tasks.Add(task);
            _context.SaveChanges();
            return task;
        }

        public Task Update(int id, Task task)
        {
            var existingTask = _context.Tasks.Find(id);
            if (existingTask == null) return null;

            existingTask.Title = task.Title;
            existingTask.Description = task.Description;
            existingTask.Completed = task.Completed;

            _context.SaveChanges();
            return existingTask;
        }

        public bool Delete(int id)
        {
            var task = _context.Tasks.Find(id);
            if (task == null) return false;

            _context.Tasks.Remove(task);
            _context.SaveChanges();
            return true;
        }
    }
}