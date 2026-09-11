using ExamBackend.Domain.Entities;

namespace ExamBackend.Repositories.Interfaces;

public interface IResultRepository : IGenericRepository<Result>
{
    Task<IEnumerable<Result>> GetResultsByUserAsync(int userId);
    Task<IEnumerable<Result>> GetResultsByExamAsync(int examId);
    Task<Result?> GetResultWithDetailsAsync(int resultId);
}
