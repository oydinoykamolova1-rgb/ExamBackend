using ExamBackend.Data;
using ExamBackend.Domain.Enums;
using ExamBackend.DTOs.Auth;
using ExamBackend.Repositories.Implementations;
using ExamBackend.Service.Implementations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace Exam.Tests;

public class AuthServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    private IConfiguration GetMockConfiguration()
    {
        var myConfiguration = new Dictionary<string, string?>
        {
            { "Jwt:Key", "SUPER_SECRET_UNIT_TEST_JWT_KEY_1234567890!" },
            { "Jwt:Issuer", "TestIssuer" },
            { "Jwt:Audience", "TestAudience" },
            { "Jwt:DurationInMinutes", "60" }
        };

        return new ConfigurationBuilder()
            .AddInMemoryCollection(myConfiguration)
            .Build();
    }

    [Fact]
    public async Task RegisterAsync_ShouldCreateUserAndReturnValidJwtToken()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var userRepo = new UserRepository(context);
        var config = GetMockConfiguration();
        var service = new AuthService(userRepo, config);

        var registerDto = new RegisterDto
        {
            FullName = "New User",
            Email = "newuser@test.com",
            Password = "SecurePassword123!",
            Role = UserRole.Student
        };

        // Act
        var response = await service.RegisterAsync(registerDto);

        // Assert
        Assert.NotNull(response);
        Assert.NotEmpty(response.Token);
        Assert.Equal("newuser@test.com", response.Email);
        Assert.Equal("Student", response.Role);

        var savedUser = await userRepo.GetByEmailAsync("newuser@test.com");
        Assert.NotNull(savedUser);
        Assert.Equal("New User", savedUser.FullName);
    }

    [Fact]
    public async Task RegisterAsync_ExistingEmail_ShouldThrowInvalidOperationException()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var userRepo = new UserRepository(context);
        var config = GetMockConfiguration();
        var service = new AuthService(userRepo, config);

        var registerDto = new RegisterDto
        {
            FullName = "First User",
            Email = "duplicate@test.com",
            Password = "Password123!",
            Role = UserRole.Student
        };

        await service.RegisterAsync(registerDto);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => service.RegisterAsync(registerDto));
    }
}
