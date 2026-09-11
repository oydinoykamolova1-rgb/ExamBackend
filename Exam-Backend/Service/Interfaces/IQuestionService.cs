using ExamBackend.DTOs.Question;

namespace ExamBackend.Service.Interfaces;

public interface IQuestionService
{
    Task<QuestionResponseDto> AddQuestionAsync(CreateQuestionDto dto);
    Task<QuestionResponseDto?> GetQuestionByIdAsync(int id);
    Task<IEnumerable<QuestionResponseDto>> GetQuestionsByExamIdAsync(int examId);
    Task<bool> DeleteQuestionAsync(int id);
}
