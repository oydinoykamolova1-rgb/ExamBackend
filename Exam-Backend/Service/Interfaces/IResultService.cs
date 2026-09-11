using ExamBackend.DTOs.Result;

namespace ExamBackend.Service.Interfaces;

public interface IResultService
{
    Task<ResultResponseDto> SubmitExamAsync(int userId, SubmitExamDto dto);
    Task<IEnumerable<ResultResponseDto>> GetUserResultsAsync(int userId);
    Task<IEnumerable<ResultResponseDto>> GetExamResultsAsync(int examId);
    Task<ResultResponseDto?> GetResultByIdAsync(int resultId);
}
