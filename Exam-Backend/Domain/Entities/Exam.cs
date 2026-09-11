namespace ExamBackend.Domain.Entities;

public class Exam
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public double PassPercentage { get; set; } = 60.0;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int CreatedById { get; set; }
    public User? CreatedBy { get; set; }

    public ICollection<Question> Questions { get; set; } = new List<Question>();
    public ICollection<Result> Results { get; set; } = new List<Result>();
}
