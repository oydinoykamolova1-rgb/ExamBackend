using ExamBackend.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExamBackend.Data.Configurations;

public class ExamConfiguration : IEntityTypeConfiguration<Exam>
{
    public void Configure(EntityTypeBuilder<Exam> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Description)
            .HasMaxLength(1000);

        builder.HasOne(e => e.CreatedBy)
            .WithMany(u => u.CreatedExams)
            .HasForeignKey(e => e.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
