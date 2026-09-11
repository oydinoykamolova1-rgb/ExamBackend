using ExamBackend.Data;
using ExamBackend.Domain.Entities;
using ExamBackend.Domain.Enums;
using ExamBackend.DTOs.Result;
using ExamBackend.Repositories.Implementations;
using ExamBackend.Service.Implementations;
using Microsoft.EntityFrameworkCore;
using Xunit;
using ExamEntity = ExamBackend.Domain.Entities.Exam;

namespace Exam.Tests;

public class ResultServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task SubmitExamAsync_ShouldCalculateScoreAndPassStatusAccurately()
    {
        // Arrange
        using var context = GetInMemoryDbContext();

        var student = new User { FullName = "Test Student", Email = "test@student.com", Role = UserRole.Student };
        var teacher = new User { FullName = "Test Teacher", Email = "test@teacher.com", Role = UserRole.Teacher };
        context.Users.AddRange(student, teacher);
        await context.SaveChangesAsync();

        var exam = new ExamEntity
        {
            Title = "Unit Test Exam",
            DurationMinutes = 15,
            PassPercentage = 70.0,
            CreatedById = teacher.Id
        };
        context.Exams.Add(exam);
        await context.SaveChangesAsync();

        // Q1: Single choice (Points: 5.0)
        var q1 = new Question
        {
            ExamId = exam.Id,
            Text = "What is 2 + 2?",
            Points = 5.0,
            Type = QuestionType.SingleChoice,
            Answers = new List<Answer>
            {
                new Answer { Text = "3", IsCorrect = false },
                new Answer { Text = "4", IsCorrect = true }
            }
        };

        // Q2: Single choice (Points: 5.0)
        var q2 = new Question
        {
            ExamId = exam.Id,
            Text = "What is the capital of France?",
            Points = 5.0,
            Type = QuestionType.SingleChoice,
            Answers = new List<Answer>
            {
                new Answer { Text = "London", IsCorrect = false },
                new Answer { Text = "Paris", IsCorrect = true }
            }
        };

        context.Questions.AddRange(q1, q2);
        await context.SaveChangesAsync();

        var resultRepo = new ResultRepository(context);
        var examRepo = new ExamRepository(context);
        var userRepo = new UserRepository(context);

        var service = new ResultService(resultRepo, examRepo, userRepo);

        // Act: Student answers Q1 correctly (4) and Q2 incorrectly (London)
        var q1CorrectAnswerId = q1.Answers.First(a => a.IsCorrect).Id;
        var q2WrongAnswerId = q2.Answers.First(a => !a.IsCorrect).Id;

        var submitDto = new SubmitExamDto
        {
            ExamId = exam.Id,
            Answers = new List<StudentAnswerDto>
            {
                new StudentAnswerDto { QuestionId = q1.Id, SelectedAnswerIds = new List<int> { q1CorrectAnswerId } },
                new StudentAnswerDto { QuestionId = q2.Id, SelectedAnswerIds = new List<int> { q2WrongAnswerId } }
            }
        };

        var result = await service.SubmitExamAsync(student.Id, submitDto);

        // Assert: 5 out of 10 points = 50% => Failed (Pass threshold is 70%)
        Assert.NotNull(result);
        Assert.Equal(5.0, result.Score);
        Assert.Equal(10.0, result.TotalPoints);
        Assert.Equal(50.0, result.Percentage);
        Assert.False(result.IsPassed);
    }
}
