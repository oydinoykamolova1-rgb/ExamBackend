using System.ComponentModel.DataAnnotations;
using ExamBackend.Domain.Enums;

namespace ExamBackend.DTOs.Question;

public class CreateQuestionDto
{
    [Required]
    public int ExamId { get; set; }

    [Required]
    public string Text { get; set; } = string.Empty;

    [Range(0.5, 100)]
    public double Points { get; set; } = 1.0;

    public QuestionType Type { get; set; } = QuestionType.SingleChoice;

    [Required]
    [MinLength(2, ErrorMessage = "A question must have at least 2 answer options.")]
    public List<AnswerOptionDto> Answers { get; set; } = new();
}
