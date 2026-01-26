using MimeKit;
using MailKit.Net.Smtp;

namespace Login.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        // ✅ 1) Simple OTP email method (email + otp)
        public async Task SendOtpEmail(string toEmail, string otp)
        {
            string subject = "Your Login OTP Code";

            string htmlBody = $@"
                <div style='font-family:Arial;padding:20px;'>
                    <h2>Your OTP Code</h2>
                    <p>Your OTP is:</p>
                    <h1 style='letter-spacing:5px;'>{otp}</h1>
                    <p>This OTP is valid for 5 minutes.</p>
                </div>";

            await SendEmailAsync(toEmail, subject, htmlBody);
        }

        // ✅ 2) Generic HTML Email Sender (Resend OTP / Magic Link / Custom)
        public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            var emailSettings = _config.GetSection("EmailSettings");

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(emailSettings["FromName"], emailSettings["FromEmail"]));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            var builder = new BodyBuilder
            {
                HtmlBody = htmlBody
            };

            message.Body = builder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(emailSettings["SmtpServer"], int.Parse(emailSettings["Port"]!), false);
            await client.AuthenticateAsync(emailSettings["Username"], emailSettings["Password"]);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
