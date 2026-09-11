namespace ExamBackend.DTOs.Result;

public class ResultResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public int ExamId { get; set; }
    public string ExamTitle { get; set; } = string.Empty;
    public double Score { get; set; }
    public double TotalPoints { get; set; }
    public double Percentage { get; set; }
    public bool IsPassed { get; set; }
    public DateTime SubmittedAt { get; set; }
    public string? DetailsJson { get; set; }
}
