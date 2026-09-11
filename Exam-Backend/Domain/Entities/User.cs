using ExamBackend.Domain.Enums;

namespace ExamBackend.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Student;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Exam> CreatedExams { get; set; } = new List<Exam>();
    public ICollection<Result> Results { get; set; } = new List<Result>();
}
