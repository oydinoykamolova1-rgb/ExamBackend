using ExamBackend.Data;
using ExamBackend.Domain.Entities;
using ExamBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ExamBackend.Repositories.Implementations;

public class ResultRepository : GenericRepository<Result>, IResultRepository
{
    public ResultRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Result>> GetResultsByUserAsync(int userId)
    {
        return await _dbSet
            .Include(r => r.Exam)
            .Include(r => r.User)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.SubmittedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Result>> GetResultsByExamAsync(int examId)
    {
        return await _dbSet
            .Include(r => r.User)
            .Include(r => r.Exam)
            .Where(r => r.ExamId == examId)
            .OrderByDescending(r => r.SubmittedAt)
            .ToListAsync();
    }

    public async Task<Result?> GetResultWithDetailsAsync(int resultId)
    {
        return await _dbSet
            .Include(r => r.User)
            .Include(r => r.Exam)
            .FirstOrDefaultAsync(r => r.Id == resultId);
    }
}
