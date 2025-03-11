using Microsoft.EntityFrameworkCore;
using TaskMicroservice.Models;
using UserMicroservice.Models;

namespace TaskMicroservice.Data
{
    public class TaskDbContext : DbContext
    {
        public TaskDbContext(DbContextOptions<TaskDbContext> options) : base(options) { }

        public DbSet<Models.Task> Tasks { get; set; }
        public DbSet<User> Users { get; set; }
    }
}