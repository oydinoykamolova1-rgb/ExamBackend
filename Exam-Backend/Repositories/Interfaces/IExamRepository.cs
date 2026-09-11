using ExamBackend.Domain.Entities;

namespace ExamBackend.Repositories.Interfaces;

public interface IExamRepository : IGenericRepository<Exam>
{
    Task<Exam?> GetExamWithQuestionsAsync(int examId);
    Task<IEnumerable<Exam>> GetActiveExamsAsync();
    Task<IEnumerable<Exam>> GetExamsByTeacherAsync(int teacherId);
}
