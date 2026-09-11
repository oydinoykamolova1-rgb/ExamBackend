using ExamBackend.DTOs.Question;
using ExamBackend.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExamBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionsController : ControllerBase
{
    private readonly IQuestionService _questionService;

    public QuestionsController(IQuestionService questionService)
    {
        _questionService = questionService;
    }

    [HttpGet("exam/{examId}")]
    public async Task<IActionResult> GetByExamId(int examId)
    {
        var questions = await _questionService.GetQuestionsByExamIdAsync(examId);
        return Ok(questions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var question = await _questionService.GetQuestionByIdAsync(id);
        if (question == null) return NotFound(new { message = $"Question with ID {id} not found." });

        return Ok(question);
    }

    [HttpPost]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> AddQuestion([FromBody] CreateQuestionDto dto)
    {
        try
        {
            var created = await _questionService.AddQuestionAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> DeleteQuestion(int id)
    {
        var success = await _questionService.DeleteQuestionAsync(id);
        if (!success) return NotFound(new { message = $"Question with ID {id} not found." });

        return NoContent();
    }
}
