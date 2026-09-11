namespace ExamBackend.DTOs.Question;

public class QuestionResponseDto
{
    public int Id { get; set; }
    public int ExamId { get; set; }
    public string Text { get; set; } = string.Empty;
    public double Points { get; set; }
    public string Type { get; set; } = string.Empty;
    public List<AnswerResponseDto> Answers { get; set; } = new();
}
