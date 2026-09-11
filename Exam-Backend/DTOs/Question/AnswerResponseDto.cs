namespace ExamBackend.DTOs.Question;

public class AnswerResponseDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool? IsCorrect { get; set; } // Nullable so when student takes exam, correct flag can be hidden if needed
}
