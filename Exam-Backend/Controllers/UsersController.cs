using System.Security.Claims;
using ExamBackend.DTOs.User;
using ExamBackend.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExamBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        int currentUserId = GetCurrentUserId();
        bool isAdmin = User.IsInRole("Admin");

        if (id != currentUserId && !isAdmin)
        {
            return Forbid();
        }

        var user = await _userService.GetUserByIdAsync(id);
        if (user == null) return NotFound(new { message = $"User with ID {id} not found." });

        return Ok(user);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
    {
        var updated = await _userService.UpdateUserAsync(id, dto);
        if (updated == null) return NotFound(new { message = $"User with ID {id} not found." });

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _userService.DeleteUserAsync(id);
        if (!success) return NotFound(new { message = $"User with ID {id} not found." });

        return NoContent();
    }

    private int GetCurrentUserId()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(idClaim, out var id) ? id : 0;
    }
}
