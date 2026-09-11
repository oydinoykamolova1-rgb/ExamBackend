using System.Text;
using ExamBackend.Data;
using ExamBackend.Domain.Entities;
using ExamBackend.Domain.Enums;
using ExamBackend.Repositories.Implementations;
using ExamBackend.Repositories.Interfaces;
using ExamBackend.Service.Implementations;
using ExamBackend.Service.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// EF Core DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories Dependency Injection
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IExamRepository, ExamRepository>();
builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
builder.Services.AddScoped<IResultRepository, ResultRepository>();

// Services Dependency Injection
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IExamService, ExamService>();
builder.Services.AddScoped<IQuestionService, QuestionService>();
builder.Services.AddScoped<IResultService, ResultService>();
builder.Services.AddScoped<IUserService, UserService>();

// JWT Authentication Configuration
var jwtKey = builder.Configuration["Jwt:Key"] ?? "SUPER_SECRET_EXAM_SYSTEM_KEY_1234567890_JWT_AUTH!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "ExamBackend";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "ExamBackendClients";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Swagger with JWT Support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Exam Backend API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Ensure Database is Created & Seeded
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // Reset database to apply rich seed data if fewer than 3 exams exist
    if (dbContext.Exams.Count() < 3)
    {
        dbContext.Database.EnsureDeleted();
        dbContext.Database.EnsureCreated();

        var adminPasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!");
        var teacherPasswordHash = BCrypt.Net.BCrypt.HashPassword("Teacher123!");
        var studentPasswordHash = BCrypt.Net.BCrypt.HashPassword("Student123!");

        var admin = new User
        {
            FullName = "System Admin",
            Email = "admin@exam.com",
            PasswordHash = adminPasswordHash,
            Role = UserRole.Admin
        };

        var teacher1 = new User
        {
            FullName = "John Teacher",
            Email = "teacher@exam.com",
            PasswordHash = teacherPasswordHash,
            Role = UserRole.Teacher
        };

        var teacher2 = new User
        {
            FullName = "Prof. Sarah Jenkins",
            Email = "sarah.teacher@exam.com",
            PasswordHash = teacherPasswordHash,
            Role = UserRole.Teacher
        };

        var student1 = new User
        {
            FullName = "Alex Student",
            Email = "student@exam.com",
            PasswordHash = studentPasswordHash,
            Role = UserRole.Student
        };

        var student2 = new User
        {
            FullName = "Maria Garcia",
            Email = "maria.student@exam.com",
            PasswordHash = studentPasswordHash,
            Role = UserRole.Student
        };

        var student3 = new User
        {
            FullName = "David Chen",
            Email = "david.student@exam.com",
            PasswordHash = studentPasswordHash,
            Role = UserRole.Student
        };

        dbContext.Users.AddRange(admin, teacher1, teacher2, student1, student2, student3);
        dbContext.SaveChanges();

        // ---------------- EXAM 1: C# & .NET Core Deep Dive ----------------
        var exam1 = new Exam
        {
            Title = "C# Language & .NET Core Fundamentals",
            Description = "Comprehensive test covering OOP, C# memory management, value types vs reference types, and async/await.",
            DurationMinutes = 25,
            PassPercentage = 70.0,
            IsActive = true,
            CreatedById = teacher1.Id
        };
        dbContext.Exams.Add(exam1);
        dbContext.SaveChanges();

        dbContext.Questions.AddRange(
            new Question
            {
                ExamId = exam1.Id,
                Text = "Which keyword is used to prevent a class from being inherited in C#?",
                Points = 2.0,
                Type = QuestionType.SingleChoice,
                Answers = new List<Answer>
                {
                    new Answer { Text = "sealed", IsCorrect = true },
                    new Answer { Text = "static", IsCorrect = false },
                    new Answer { Text = "abstract", IsCorrect = false },
                    new Answer { Text = "private", IsCorrect = false }
                }
            },
            new Question
            {
                ExamId = exam1.Id,
                Text = "What is the default access modifier for members declared inside a C# class?",
                Points = 2.0,
                Type = QuestionType.SingleChoice,
                Answers = new List<Answer>
                {
                    new Answer { Text = "public", IsCorrect = false },
                    new Answer { Text = "internal", IsCorrect = false },
                    new Answer { Text = "private", IsCorrect = true },
                    new Answer { Text = "protected", IsCorrect = false }
                }
            },
            new Question
            {
                ExamId = exam1.Id,
                Text = "Which of the following are Value Types in C#? (Select all that apply)",
                Points = 3.0,
                Type = QuestionType.MultipleChoice,
                Answers = new List<Answer>
                {
                    new Answer { Text = "System.Int32 (int)", IsCorrect = true },
                    new Answer { Text = "System.String (string)", IsCorrect = false },
                    new Answer { Text = "System.DateTime (struct)", IsCorrect = true },
                    new Answer { Text = "Custom Class (class)", IsCorrect = false }
                }
            },
            new Question
            {
                ExamId = exam1.Id,
                Text = "What is the primary role of the Garbage Collector (GC) in .NET?",
                Points = 2.0,
                Type = QuestionType.SingleChoice,
                Answers = new List<Answer>
                {
                    new Answer { Text = "Automatic memory allocation & cleanup for reference objects on the heap", IsCorrect = true },
                    new Answer { Text = "Compiling C# code into native assembly binaries", IsCorrect = false },
                    new Answer { Text = "Encrypting strings stored in application configuration", IsCorrect = false },
                    new Answer { Text = "Managing multi-thread locks and sync semaphores", IsCorrect = false }
                }
            },
            new Question
            {
                ExamId = exam1.Id,
                Text = "What does the 'async' modifier on a C# method enable?",
                Points = 2.0,
                Type = QuestionType.SingleChoice,
                Answers = new List<Answer>
                {
                    new Answer { Text = "Allows the method to use the 'await' keyword for non-blocking asynchronous execution", IsCorrect = true },
                    new Answer { Text = "Spawns a hardware thread pinned to CPU Core 0", IsCorrect = false },
                    new Answer { Text = "Makes the method run twice in parallel", IsCorrect = false },
                    new Answer { Text = "Disables exception throwing during runtime", IsCorrect = false }
                }
            }
        );
        dbContext.SaveChanges();

        // ---------------- EXAM 2: Entity Framework Core & SQL ----------------
        var exam2 = new Exam
        {
            Title = "Entity Framework Core & SQL Database Architecture",
            Description = "Mastery exam testing EF Core query optimization, eager loading, migrations, and relational schema configuration.",
            DurationMinutes = 30,
            PassPercentage = 65.0,
            IsActive = true,
            CreatedById = teacher2.Id
        };
        dbContext.Exams.Add(exam2);
        dbContext.SaveChanges();

        dbContext.Questions.AddRange(
            new Question
            {
                ExamId = exam2.Id,
                Text = "Which EF Core method is used to perform Eager Loading for related navigation entities?",
                Points = 2.5,
                Type = QuestionType.SingleChoice,
                Answers = new List<Answer>
                {
                    new Answer { Text = "Include()", IsCorrect = true },
                    new Answer { Text = "Join()", IsCorrect = false },
                    new Answer { Text = "Attach()", IsCorrect = false },
                    new Answer { Text = "LoadRelated()", IsCorrect = false }
                }
            },
            new Question
            {
                ExamId = exam2.Id,
                Text = "Which tracking configuration optimizes read-only queries in EF Core by disabling change tracking overhead?",
                Points = 2.5,
                Type = QuestionType.SingleChoice,
                Answers = new List<Answer>
                {
                    new Answer { Text = "AsNoTracking()", IsCorrect = true },
                    new Answer { Text = "AsReadOnly()", IsCorrect = false },
                    new Answer { Text = "DisableTracking()", IsCorrect = false },
                    new Answer { Text = "UseState(Detached)", IsCorrect = false }
                }
            },
            new Question
            {
                ExamId = exam2.Id,
                Text = "Which SQL clause is used to filter records aggregated by a GROUP BY clause?",
                Points = 2.5,
                Type = QuestionType.SingleChoice,
                Answers = new List<Answer>
                {
                    new Answer { Text = "HAVING", IsCorrect = true },
                    new Answer { Text = "WHERE", IsCorrect = false },
                    new Answer { Text = "ORDER BY", IsCorrect = false },
                    new Answer { Text = "FILTER", IsCorrect = false }
                }
            },
            new Question
            {
                ExamId = exam2.Id,
                Text = "In EF Core Fluent API, which method configures a One-to-Many entity relationship?",
                Points = 2.5,
                Type = QuestionType.SingleChoice,
                Answers = new List<Answer>
                {
                    new Answer { Text = "HasMany().WithOne()", IsCorrect = true },
                    new Answer { Text = "HasOne().WithOne()", IsCorrect = false },
                    new Answer { Text = "HasMany().WithMany()", IsCorrect = false },
                    new Answer { Text = "BelongsTo().HasMany()", IsCorrect = false }
                }
            }
        );
        dbContext.SaveChanges();

        // ---------------- EXAM 3: RESTful Web API & JWT Security ----------------
        var exam3 = new Exam
        {
            Title = "RESTful Web API Architecture & JWT Auth",
            Description = "Evaluation on HTTP verbs, status codes, JWT claims, middleware pipeline, and API security best practices.",
            DurationMinutes = 20,
            PassPercentage = 75.0,
            IsActive = true,
            CreatedById = teacher1.Id
        };
        dbContext.Exams.Add(exam3);
        dbContext.SaveChanges();

        dbContext.Questions.AddRange(
            new Question
            {
                ExamId = exam3.Id,
                Text = "Which HTTP status code is standard when a server successfully creates a new resource?",
                Points = 2.0,
                Type = QuestionType.SingleChoice,
                Answers = new List<Answer>
                {
                    new Answer { Text = "201 Created", IsCorrect = true },
                    new Answer { Text = "200 OK", IsCorrect = false },
                    new Answer { Text = "204 No Content", IsCorrect = false },
                    new Answer { Text = "202 Accepted", IsCorrect = false }
                }
            },
            new Question
            {
                ExamId = exam3.Id,
                Text = "Which section of a JSON Web Token (JWT) stores identity claims (e.g. User ID, Role, Expiration)?",
                Points = 2.0,
                Type = QuestionType.SingleChoice,
                Answers = new List<Answer>
                {
                    new Answer { Text = "Payload", IsCorrect = true },
                    new Answer { Text = "Header", IsCorrect = false },
                    new Answer { Text = "Signature", IsCorrect = false },
                    new Answer { Text = "Secret Key", IsCorrect = false }
                }
            },
            new Question
            {
                ExamId = exam3.Id,
                Text = "Which HTTP methods are classified as Idempotent according to RFC specifications? (Select all that apply)",
                Points = 3.0,
                Type = QuestionType.MultipleChoice,
                Answers = new List<Answer>
                {
                    new Answer { Text = "GET", IsCorrect = true },
                    new Answer { Text = "PUT", IsCorrect = true },
                    new Answer { Text = "DELETE", IsCorrect = true },
                    new Answer { Text = "POST", IsCorrect = false }
                }
            }
        );
        dbContext.SaveChanges();

        // ---------------- Seed Sample Results ----------------
        var result1 = new Result
        {
            UserId = student1.Id,
            ExamId = exam1.Id,
            Score = 9.0,
            TotalPoints = 11.0,
            Percentage = 81.82,
            IsPassed = true,
            SubmittedAt = DateTime.UtcNow.AddDays(-2),
            DetailsJson = "[{\"QuestionId\":1,\"QuestionText\":\"Which keyword is used to prevent a class from being inherited in C#?\",\"PointsEarned\":2.0,\"TotalQuestionPoints\":2.0,\"IsCorrect\":true}]"
        };

        var result2 = new Result
        {
            UserId = student2.Id,
            ExamId = exam1.Id,
            Score = 11.0,
            TotalPoints = 11.0,
            Percentage = 100.0,
            IsPassed = true,
            SubmittedAt = DateTime.UtcNow.AddDays(-1),
            DetailsJson = "[{\"QuestionId\":1,\"QuestionText\":\"Which keyword is used to prevent a class from being inherited in C#?\",\"PointsEarned\":2.0,\"TotalQuestionPoints\":2.0,\"IsCorrect\":true}]"
        };

        var result3 = new Result
        {
            UserId = student3.Id,
            ExamId = exam2.Id,
            Score = 5.0,
            TotalPoints = 10.0,
            Percentage = 50.0,
            IsPassed = false,
            SubmittedAt = DateTime.UtcNow.AddHours(-5),
            DetailsJson = "[{\"QuestionId\":6,\"QuestionText\":\"Which EF Core method is used to perform Eager Loading for related navigation entities?\",\"PointsEarned\":2.5,\"TotalQuestionPoints\":2.5,\"IsCorrect\":true}]"
        };

        dbContext.Results.AddRange(result1, result2, result3);
        dbContext.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
