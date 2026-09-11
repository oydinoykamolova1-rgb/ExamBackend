using ExamBackend.Data;
using ExamBackend.Domain.Entities;
using ExamBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ExamBackend.Repositories.Implementations;

public class ExamRepository : GenericRepository<Exam>, IExamRepository
{
    public ExamRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Exam?> GetExamWithQuestionsAsync(int examId)
    {
        return await _dbSet
            .Include(e => e.CreatedBy)
            .Include(e => e.Questions)
                .ThenInclude(q => q.Answers)
            .FirstOrDefaultAsync(e => e.Id == examId);
    }

    public async Task<IEnumerable<Exam>> GetActiveExamsAsync()
    {
        return await _dbSet
            .Include(e => e.CreatedBy)
            .Include(e => e.Questions)
            .Where(e => e.IsActive)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Exam>> GetExamsByTeacherAsync(int teacherId)
    {
        return await _dbSet
            .Include(e => e.Questions)
            .Where(e => e.CreatedById == teacherId)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }
}
