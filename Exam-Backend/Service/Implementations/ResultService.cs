using System.Text.Json;
using ExamBackend.Domain.Entities;
using ExamBackend.DTOs.Result;
using ExamBackend.Repositories.Interfaces;
using ExamBackend.Service.Interfaces;

namespace ExamBackend.Service.Implementations;

public class ResultService : IResultService
{
    private readonly IResultRepository _resultRepository;
    private readonly IExamRepository _examRepository;
    private readonly IUserRepository _userRepository;

    public ResultService(
        IResultRepository resultRepository,
        IExamRepository examRepository,
        IUserRepository userRepository)
    {
        _resultRepository = resultRepository;
        _examRepository = examRepository;
        _userRepository = userRepository;
    }

    public async Task<ResultResponseDto> SubmitExamAsync(int userId, SubmitExamDto dto)
    {
        var exam = await _examRepository.GetExamWithQuestionsAsync(dto.ExamId);
        if (exam == null)
        {
            throw new KeyNotFoundException($"Exam with ID {dto.ExamId} not found.");
        }

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException($"User with ID {userId} not found.");
        }

        double earnedScore = 0;
        double totalPoints = exam.Questions.Sum(q => q.Points);

        var detailsList = new List<object>();

        foreach (var question in exam.Questions)
        {
            var studentAns = dto.Answers.FirstOrDefault(a => a.QuestionId == question.Id);
            var selectedIds = studentAns?.SelectedAnswerIds ?? new List<int>();

            var correctIds = question.Answers
                .Where(a => a.IsCorrect)
                .Select(a => a.Id)
                .OrderBy(id => id)
                .ToList();

            var studentOrderedIds = selectedIds.OrderBy(id => id).ToList();

            bool isCorrect = correctIds.SequenceEqual(studentOrderedIds);
            double pointsEarned = isCorrect ? question.Points : 0;
            earnedScore += pointsEarned;

            detailsList.Add(new
            {
                QuestionId = question.Id,
                QuestionText = question.Text,
                PointsEarned = pointsEarned,
                TotalQuestionPoints = question.Points,
                IsCorrect = isCorrect,
                SelectedAnswerIds = selectedIds,
                CorrectAnswerIds = correctIds
            });
        }

        double percentage = totalPoints > 0 ? (earnedScore / totalPoints) * 100.0 : 0.0;
        bool isPassed = percentage >= exam.PassPercentage;

        var result = new Result
        {
            UserId = userId,
            ExamId = dto.ExamId,
            Score = Math.Round(earnedScore, 2),
            TotalPoints = Math.Round(totalPoints, 2),
            Percentage = Math.Round(percentage, 2),
            IsPassed = isPassed,
            SubmittedAt = DateTime.UtcNow,
            DetailsJson = JsonSerializer.Serialize(detailsList)
        };

        await _resultRepository.AddAsync(result);
        await _resultRepository.SaveChangesAsync();

        return new ResultResponseDto
        {
            Id = result.Id,
            UserId = user.Id,
            StudentName = user.FullName,
            ExamId = exam.Id,
            ExamTitle = exam.Title,
            Score = result.Score,
            TotalPoints = result.TotalPoints,
            Percentage = result.Percentage,
            IsPassed = result.IsPassed,
            SubmittedAt = result.SubmittedAt,
            DetailsJson = result.DetailsJson
        };
    }

    public async Task<IEnumerable<ResultResponseDto>> GetUserResultsAsync(int userId)
    {
        var results = await _resultRepository.GetResultsByUserAsync(userId);
        return results.Select(MapToDto);
    }

    public async Task<IEnumerable<ResultResponseDto>> GetExamResultsAsync(int examId)
    {
        var results = await _resultRepository.GetResultsByExamAsync(examId);
        return results.Select(MapToDto);
    }

    public async Task<ResultResponseDto?> GetResultByIdAsync(int resultId)
    {
        var result = await _resultRepository.GetResultWithDetailsAsync(resultId);
        if (result == null) return null;

        return MapToDto(result);
    }

    private static ResultResponseDto MapToDto(Result r)
    {
        return new ResultResponseDto
        {
            Id = r.Id,
            UserId = r.UserId,
            StudentName = r.User?.FullName ?? string.Empty,
            ExamId = r.ExamId,
            ExamTitle = r.Exam?.Title ?? string.Empty,
            Score = r.Score,
            TotalPoints = r.TotalPoints,
            Percentage = r.Percentage,
            IsPassed = r.IsPassed,
            SubmittedAt = r.SubmittedAt,
            DetailsJson = r.DetailsJson
        };
    }
}
