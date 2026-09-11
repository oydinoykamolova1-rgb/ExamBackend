using ExamBackend.Domain.Enums;

namespace ExamBackend.Domain.Entities;

public class Question
{
    public int Id { get; set; }
    public int ExamId { get; set; }
    public Exam? Exam { get; set; }

    public string Text { get; set; } = string.Empty;
    public double Points { get; set; } = 1.0;
    public QuestionType Type { get; set; } = QuestionType.SingleChoice;

    public ICollection<Answer> Answers { get; set; } = new List<Answer>();
}
