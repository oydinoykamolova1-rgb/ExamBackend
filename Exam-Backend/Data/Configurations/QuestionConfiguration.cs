using ExamBackend.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExamBackend.Data.Configurations;

public class QuestionConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.Text)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(q => q.Type)
            .HasConversion<string>();

        builder.HasOne(q => q.Exam)
            .WithMany(e => e.Questions)
            .HasForeignKey(q => q.ExamId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
