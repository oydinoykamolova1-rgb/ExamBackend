using ExamBackend.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExamBackend.Data.Configurations;

public class ResultConfiguration : IEntityTypeConfiguration<Result>
{
    public void Configure(EntityTypeBuilder<Result> builder)
    {
        builder.HasKey(r => r.Id);

        builder.HasOne(r => r.User)
            .WithMany(u => u.Results)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.Exam)
            .WithMany(e => e.Results)
            .HasForeignKey(r => r.ExamId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
