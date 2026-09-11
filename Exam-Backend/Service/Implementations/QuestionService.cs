using ExamBackend.Domain.Entities;
using ExamBackend.DTOs.Question;
using ExamBackend.Repositories.Interfaces;
using ExamBackend.Service.Interfaces;

namespace ExamBackend.Service.Implementations;

public class QuestionService : IQuestionService
{
    private readonly IQuestionRepository _questionRepository;
    private readonly IExamRepository _examRepository;

    public QuestionService(IQuestionRepository questionRepository, IExamRepository examRepository)
    {
        _questionRepository = questionRepository;
        _examRepository = examRepository;
    }

    public async Task<QuestionResponseDto> AddQuestionAsync(CreateQuestionDto dto)
    {
        var exam = await _examRepository.GetByIdAsync(dto.ExamId);
        if (exam == null)
        {
            throw new KeyNotFoundException($"Exam with ID {dto.ExamId} not found.");
        }

        var question = new Question
        {
            ExamId = dto.ExamId,
            Text = dto.Text,
            Points = dto.Points,
            Type = dto.Type,
            Answers = dto.Answers.Select(a => new Answer
            {
                Text = a.Text,
                IsCorrect = a.IsCorrect
            }).ToList()
        };

        await _questionRepository.AddAsync(question);
        await _questionRepository.SaveChangesAsync();

        return MapToDto(question);
    }

    public async Task<QuestionResponseDto?> GetQuestionByIdAsync(int id)
    {
        var question = await _questionRepository.GetQuestionWithAnswersAsync(id);
        if (question == null) return null;

        return MapToDto(question);
    }

    public async Task<IEnumerable<QuestionResponseDto>> GetQuestionsByExamIdAsync(int examId)
    {
        var questions = await _questionRepository.GetQuestionsByExamIdAsync(examId);
        return questions.Select(MapToDto);
    }

    public async Task<bool> DeleteQuestionAsync(int id)
    {
        var question = await _questionRepository.GetByIdAsync(id);
        if (question == null) return false;

        _questionRepository.Remove(question);
        return await _questionRepository.SaveChangesAsync();
    }

    private static QuestionResponseDto MapToDto(Question q)
    {
        return new QuestionResponseDto
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
                IsCorrect = a.IsCorrect
            }).ToList()
        };
    }
}
