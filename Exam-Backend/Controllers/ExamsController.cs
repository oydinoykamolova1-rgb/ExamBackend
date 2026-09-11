using System.Security.Claims;
using ExamBackend.DTOs.Exam;
using ExamBackend.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExamBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExamsController : ControllerBase
{
    private readonly IExamService _examService;

    public ExamsController(IExamService examService)
    {
        _examService = examService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllActive()
    {
        var exams = await _examService.GetAllActiveExamsAsync();
        return Ok(exams);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        bool isTeacherOrAdmin = User.IsInRole("Teacher") || User.IsInRole("Admin");
        var exam = await _examService.GetExamByIdAsync(id, includeCorrectAnswers: isTeacherOrAdmin);
        if (exam == null) return NotFound(new { message = $"Exam with ID {id} not found." });

        return Ok(exam);
    }

    [HttpGet("my-created")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> GetMyCreatedExams()
    {
        int userId = GetCurrentUserId();
        var exams = await _examService.GetExamsByTeacherAsync(userId);
        return Ok(exams);
    }

    [HttpPost]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Create([FromBody] CreateExamDto dto)
    {
        int userId = GetCurrentUserId();
        var result = await _examService.CreateExamAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateExamDto dto)
    {
        try
        {
            int userId = GetCurrentUserId();
            bool isAdmin = User.IsInRole("Admin");

            var updated = await _examService.UpdateExamAsync(id, dto, userId, isAdmin);
            if (updated == null) return NotFound(new { message = $"Exam with ID {id} not found." });

            return Ok(updated);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            int userId = GetCurrentUserId();
            bool isAdmin = User.IsInRole("Admin");

            var success = await _examService.DeleteExamAsync(id, userId, isAdmin);
            if (!success) return NotFound(new { message = $"Exam with ID {id} not found." });

            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }

    private int GetCurrentUserId()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(idClaim, out var id) ? id : 0;
    }
}
