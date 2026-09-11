using System.ComponentModel.DataAnnotations;

namespace ExamBackend.DTOs.Exam;

public class CreateExamDto
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Range(1, 1440)]
    public int DurationMinutes { get; set; } = 30;

    [Range(0, 100)]
    public double PassPercentage { get; set; } = 60.0;
}
