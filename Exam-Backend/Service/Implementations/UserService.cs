using ExamBackend.DTOs.User;
using ExamBackend.Repositories.Interfaces;
using ExamBackend.Service.Interfaces;

namespace ExamBackend.Service.Implementations;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(u => new UserDto
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email,
            Role = u.Role,
            CreatedAt = u.CreatedAt
        });
    }

    public async Task<UserDto?> GetUserByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto dto)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return null;

        user.FullName = dto.FullName;
        user.Role = dto.Role;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();

        return new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return false;

        _userRepository.Remove(user);
        return await _userRepository.SaveChangesAsync();
    }
}
