using ExamBackend.DTOs.User;

namespace ExamBackend.Service.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task<UserDto?> GetUserByIdAsync(int id);
    Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto dto);
    Task<bool> DeleteUserAsync(int id);
}
