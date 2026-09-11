using System.ComponentModel.DataAnnotations;

namespace ExamBackend.DTOs.Result;

public class SubmitExamDto
{
    [Required]
    public int ExamId { get; set; }

    [Required]
    public List<StudentAnswerDto> Answers { get; set; } = new();
}
