using System.Security.Claims;
using ExamBackend.DTOs.Result;
using ExamBackend.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExamBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ResultsController : ControllerBase
{
    private readonly IResultService _resultService;

    public ResultsController(IResultService resultService)
    {
        _resultService = resultService;
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitExam([FromBody] SubmitExamDto dto)
    {
        try
        {
            int userId = GetCurrentUserId();
            var result = await _resultService.SubmitExamAsync(userId, dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("my-results")]
    public async Task<IActionResult> GetMyResults()
    {
        int userId = GetCurrentUserId();
        var results = await _resultService.GetUserResultsAsync(userId);
        return Ok(results);
    }

    [HttpGet("exam/{examId}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> GetExamResults(int examId)
    {
        var results = await _resultService.GetExamResultsAsync(examId);
        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _resultService.GetResultByIdAsync(id);
        if (result == null) return NotFound(new { message = $"Result with ID {id} not found." });

        int currentUserId = GetCurrentUserId();
        bool isTeacherOrAdmin = User.IsInRole("Teacher") || User.IsInRole("Admin");

        if (result.UserId != currentUserId && !isTeacherOrAdmin)
        {
            return Forbid();
        }

        return Ok(result);
    }

    private int GetCurrentUserId()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(idClaim, out var id) ? id : 0;
    }
}
