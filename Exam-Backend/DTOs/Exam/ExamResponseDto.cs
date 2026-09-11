using ExamBackend.DTOs.Question;

namespace ExamBackend.DTOs.Exam;

public class ExamResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public double PassPercentage { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public int CreatedById { get; set; }
    public string CreatedByName { get; set; } = string.Empty;
    public int QuestionsCount { get; set; }
    public List<QuestionResponseDto> Questions { get; set; } = new();
}
