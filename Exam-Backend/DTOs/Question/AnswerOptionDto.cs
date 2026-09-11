using System.ComponentModel.DataAnnotations;

namespace ExamBackend.DTOs.Question;

public class AnswerOptionDto
{
    [Required]
    public string Text { get; set; } = string.Empty;

    public bool IsCorrect { get; set; }
}
