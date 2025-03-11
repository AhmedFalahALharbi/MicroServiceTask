using Microsoft.AspNetCore.Mvc;
using TaskMicroservice.Models;
using TaskMicroservice.Services;
using Task = TaskMicroservice.Models.Task;

namespace TaskMicroservice.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TasksController(TaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_taskService.GetAll());

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var task = _taskService.GetById(id);
            return task != null ? Ok(task) : NotFound();
        }

        [HttpPost]
        public IActionResult Create([FromBody] Task task)
        {
            var createdTask = _taskService.Create(task);
            return CreatedAtAction(nameof(GetById), new { id = createdTask.Id }, createdTask);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Task task)
        {
            var updatedTask = _taskService.Update(id, task);
            return updatedTask != null ? Ok(updatedTask) : NotFound();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return _taskService.Delete(id) ? NoContent() : NotFound();
        }
    }
}