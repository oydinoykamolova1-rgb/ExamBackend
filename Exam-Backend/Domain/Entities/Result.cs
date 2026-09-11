namespace ExamBackend.Domain.Entities;

public class Result
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }

    public int ExamId { get; set; }
    public Exam? Exam { get; set; }

    public double Score { get; set; }
    public double TotalPoints { get; set; }
    public double Percentage { get; set; }
    public bool IsPassed { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    public string? DetailsJson { get; set; }
}
