using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using ExamBackend.Domain.Entities;
using ExamBackend.DTOs.Auth;
using ExamBackend.Repositories.Interfaces;
using ExamBackend.Service.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ExamBackend.Service.Implementations;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        if (await _userRepository.EmailExistsAsync(dto.Email))
        {
            throw new InvalidOperationException("User with this email already exists.");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = passwordHash,
            Role = dto.Role,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString()
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString()
        };
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var secretKey = jwtSettings["Key"] ?? "SUPER_SECRET_EXAM_SYSTEM_KEY_1234567890!";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiryMinutes = int.TryParse(jwtSettings["DurationInMinutes"], out var mins) ? mins : 120;

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"] ?? "ExamBackend",
            audience: jwtSettings["Audience"] ?? "ExamBackendClients",
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
