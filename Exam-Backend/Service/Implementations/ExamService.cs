using ExamBackend.Domain.Entities;
using ExamBackend.DTOs.Exam;
using ExamBackend.DTOs.Question;
using ExamBackend.Repositories.Interfaces;
using ExamBackend.Service.Interfaces;

namespace ExamBackend.Service.Implementations;

public class ExamService : IExamService
{
    private readonly IExamRepository _examRepository;

    public ExamService(IExamRepository examRepository)
    {
        _examRepository = examRepository;
    }

    public async Task<IEnumerable<ExamResponseDto>> GetAllActiveExamsAsync()
    {
        var exams = await _examRepository.GetActiveExamsAsync();
        return exams.Select(MapToResponseDto);
    }

    public async Task<IEnumerable<ExamResponseDto>> GetExamsByTeacherAsync(int teacherId)
    {
        var exams = await _examRepository.GetExamsByTeacherAsync(teacherId);
        return exams.Select(MapToResponseDto);
    }

    public async Task<ExamResponseDto?> GetExamByIdAsync(int id, bool includeCorrectAnswers = false)
    {
        var exam = await _examRepository.GetExamWithQuestionsAsync(id);
        if (exam == null) return null;

        return MapToResponseDto(exam, includeCorrectAnswers);
    }

    public async Task<ExamResponseDto> CreateExamAsync(CreateExamDto dto, int createdById)
    {
        var exam = new Exam
        {
            Title = dto.Title,
            Description = dto.Description,
            DurationMinutes = dto.DurationMinutes,
            PassPercentage = dto.PassPercentage,
            IsActive = true,
            CreatedById = createdById,
            CreatedAt = DateTime.UtcNow
        };

        await _examRepository.AddAsync(exam);
        await _examRepository.SaveChangesAsync();

        return MapToResponseDto(exam);
    }

    public async Task<ExamResponseDto?> UpdateExamAsync(int id, UpdateExamDto dto, int currentUserId, bool isAdmin)
    {
        var exam = await _examRepository.GetByIdAsync(id);
        if (exam == null) return null;

        if (!isAdmin && exam.CreatedById != currentUserId)
        {
            throw new UnauthorizedAccessException("You are not authorized to update this exam.");
        }

        exam.Title = dto.Title;
        exam.Description = dto.Description;
        exam.DurationMinutes = dto.DurationMinutes;
        exam.PassPercentage = dto.PassPercentage;
        exam.IsActive = dto.IsActive;

        _examRepository.Update(exam);
        await _examRepository.SaveChangesAsync();

        return MapToResponseDto(exam);
    }

    public async Task<bool> DeleteExamAsync(int id, int currentUserId, bool isAdmin)
    {
        var exam = await _examRepository.GetByIdAsync(id);
        if (exam == null) return false;

        if (!isAdmin && exam.CreatedById != currentUserId)
        {
            throw new UnauthorizedAccessException("You are not authorized to delete this exam.");
        }

        _examRepository.Remove(exam);
        return await _examRepository.SaveChangesAsync();
    }

    private static ExamResponseDto MapToResponseDto(Exam exam) => MapToResponseDto(exam, false);

    private static ExamResponseDto MapToResponseDto(Exam exam, bool includeCorrectAnswers)
    {
        return new ExamResponseDto
        {
            Id = exam.Id,
            Title = exam.Title,
            Description = exam.Description,
            DurationMinutes = exam.DurationMinutes,
            PassPercentage = exam.PassPercentage,
            IsActive = exam.IsActive,
            CreatedAt = exam.CreatedAt,
            CreatedById = exam.CreatedById,
            CreatedByName = exam.CreatedBy?.FullName ?? string.Empty,
            QuestionsCount = exam.Questions.Count,
            Questions = exam.Questions.Select(q => new QuestionResponseDto
            {
                Id = q.Id,
                ExamId = q.ExamId,
                Text = q.Text,
                Points = q.Points,
                Type = q.Type.ToString(),
                Answers = q.Answers.Select(a => new AnswerResponseDto
                {
                    Id = a.Id,
                    Text = a.Text,
                    IsCorrect = includeCorrectAnswers ? a.IsCorrect : null
                }).ToList()
            }).ToList()
        };
    }
}
