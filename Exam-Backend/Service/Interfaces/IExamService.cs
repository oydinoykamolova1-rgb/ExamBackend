using ExamBackend.DTOs.Exam;

namespace ExamBackend.Service.Interfaces;

public interface IExamService
{
    Task<IEnumerable<ExamResponseDto>> GetAllActiveExamsAsync();
    Task<IEnumerable<ExamResponseDto>> GetExamsByTeacherAsync(int teacherId);
    Task<ExamResponseDto?> GetExamByIdAsync(int id, bool includeCorrectAnswers = false);
    Task<ExamResponseDto> CreateExamAsync(CreateExamDto dto, int createdById);
    Task<ExamResponseDto?> UpdateExamAsync(int id, UpdateExamDto dto, int currentUserId, bool isAdmin);
    Task<bool> DeleteExamAsync(int id, int currentUserId, bool isAdmin);
}
