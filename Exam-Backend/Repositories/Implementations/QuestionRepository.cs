using ExamBackend.Data;
using ExamBackend.Domain.Entities;
using ExamBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ExamBackend.Repositories.Implementations;

public class QuestionRepository : GenericRepository<Question>, IQuestionRepository
{
    public QuestionRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Question?> GetQuestionWithAnswersAsync(int questionId)
    {
        return await _dbSet
            .Include(q => q.Answers)
            .FirstOrDefaultAsync(q => q.Id == questionId);
    }

    public async Task<IEnumerable<Question>> GetQuestionsByExamIdAsync(int examId)
    {
        return await _dbSet
            .Include(q => q.Answers)
            .Where(q => q.ExamId == examId)
            .ToListAsync();
    }
}
