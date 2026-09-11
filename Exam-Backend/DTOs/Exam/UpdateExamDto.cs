using System.ComponentModel.DataAnnotations;

namespace ExamBackend.DTOs.Exam;

public class UpdateExamDto
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Range(1, 1440)]
    public int DurationMinutes { get; set; }

    [Range(0, 100)]
    public double PassPercentage { get; set; }

    public bool IsActive { get; set; }
}
