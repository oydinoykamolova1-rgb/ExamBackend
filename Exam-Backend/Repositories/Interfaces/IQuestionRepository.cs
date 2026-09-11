using ExamBackend.Domain.Entities;

namespace ExamBackend.Repositories.Interfaces;

public interface IQuestionRepository : IGenericRepository<Question>
{
    Task<Question?> GetQuestionWithAnswersAsync(int questionId);
    Task<IEnumerable<Question>> GetQuestionsByExamIdAsync(int examId);
}
