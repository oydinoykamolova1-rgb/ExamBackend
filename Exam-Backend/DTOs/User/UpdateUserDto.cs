using System.ComponentModel.DataAnnotations;
using ExamBackend.Domain.Enums;

namespace ExamBackend.DTOs.User;

public class UpdateUserDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string FullName { get; set; } = string.Empty;

    public UserRole Role { get; set; }
}
