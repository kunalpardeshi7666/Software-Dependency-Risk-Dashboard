using DependencySystem.API.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace DependencySystem.API.DAL
{
 


        public class OtpVerificationConfig : IEntityTypeConfiguration<OtpVerification>
        {
            public void Configure(EntityTypeBuilder<OtpVerification> builder)
            {
                builder.HasKey(x => x.Id);

                builder.Property(x => x.Email)
                       .IsRequired()
                       .HasMaxLength(256);

                builder.Property(x => x.Otp)
                       .IsRequired()
                       .HasMaxLength(6);

                builder.Property(x => x.Purpose)
                       .IsRequired()
                       .HasMaxLength(50);

                builder.Property(x => x.ExpiresAt)
                       .IsRequired();

                builder.HasIndex(x => new { x.Email, x.Otp, x.Purpose });
            }
        }
    

}
