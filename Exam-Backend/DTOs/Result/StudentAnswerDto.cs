using System.ComponentModel.DataAnnotations;

namespace ExamBackend.DTOs.Result;

public class StudentAnswerDto
{
    [Required]
    public int QuestionId { get; set; }

    public List<int> SelectedAnswerIds { get; set; } = new();
}
