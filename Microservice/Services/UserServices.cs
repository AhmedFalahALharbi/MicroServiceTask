using Microsoft.EntityFrameworkCore;
using TaskMicroservice.Data;
using UserMicroservice.Models;

namespace UserMicroservice.Services
{
    public class UserService
    {
        private readonly TaskDbContext _context;

        public UserService(TaskDbContext context)
        {
            _context = context;
        }

        // Create
        public async Task<User> CreateUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        // Read (All)
        public async Task<List<User>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // Read (By ID)
        public async Task<User> GetUserById(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        // Update
        public async Task<User> UpdateUser(int id, User user)
        {
            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null) return null;

            existingUser.Username = user.Username;
            existingUser.Email = user.Email;

            await _context.SaveChangesAsync();
            return existingUser;
        }

        // Delete
        public async Task<bool> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}