
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;


    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendOtpAsync(string toEmail, string otp)
        {
            // Read correct section
            var emailSettings = _config.GetSection("EmailSettings");

            var smtpServer = emailSettings["SmtpServer"];
            var port = emailSettings["Port"];
            var username = emailSettings["Username"];
            var password = emailSettings["Password"];
            var fromEmail = emailSettings["FromEmail"];
            var fromName = emailSettings["FromName"];

            // Defensive validation
            if (string.IsNullOrWhiteSpace(smtpServer) ||
                string.IsNullOrWhiteSpace(port) ||
                string.IsNullOrWhiteSpace(username) ||
                string.IsNullOrWhiteSpace(password) ||
                string.IsNullOrWhiteSpace(fromEmail))
            {
                throw new Exception("EmailSettings configuration is missing or invalid.");
            }

            using var smtp = new SmtpClient(smtpServer, int.Parse(port))
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true
            };

            var mail = new MailMessage
            {
                From = new MailAddress(fromEmail, fromName),
                Subject = "Your OTP Code",
                Body = $"Your OTP is <b>{otp}</b>. Valid for 10 minutes.",
                IsBodyHtml = true
            };

            mail.To.Add(toEmail);

            await smtp.SendMailAsync(mail);
        }
    }

