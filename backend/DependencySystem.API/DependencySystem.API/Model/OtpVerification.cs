



        public class OtpVerification
        {
            public int Id { get; set; }

            public string Email { get; set; } = string.Empty;

            public string Otp { get; set; } = string.Empty;

            public string Purpose { get; set; } = string.Empty;
            // EMAIL_VERIFICATION, RESET_PASSWORD

            public DateTime ExpiresAt { get; set; }

            public bool IsUsed { get; set; }


        // 🔐 Security tracking
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
    

