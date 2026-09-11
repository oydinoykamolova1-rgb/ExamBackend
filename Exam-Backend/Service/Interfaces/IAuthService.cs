using ExamBackend.DTOs.Auth;

namespace ExamBackend.Service.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
}
