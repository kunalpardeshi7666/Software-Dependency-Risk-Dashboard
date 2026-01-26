using Login.Data;
using Login.DTO;

using Login.Model;

using Login.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace Login.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly EmailService _emailService;
        private readonly JwtService _jwtService;
        private readonly IConfiguration _config;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthController(
            AppDbContext db,
            EmailService emailService,
            JwtService jwtService,
            IConfiguration config)
        {
            _db = db;
            _emailService = emailService;
            _jwtService = jwtService;
            _config = config;
            _passwordHasher = new PasswordHasher<User>();
        }

        // ================================
        // ✅ REGISTER
        // POST: api/auth/register
        // ================================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if (req == null ||
                string.IsNullOrWhiteSpace(req.Email) ||
                string.IsNullOrWhiteSpace(req.Password))
            {
                return BadRequest(new { message = "Email and Password are required" });
            }

            var email = NormalizeEmail(req.Email);

            var exists = await _db.Users.AnyAsync(u => u.Email == email);
            if (exists)
                return BadRequest(new { message = "Email already exists" });

            var user = new User
            {
                Email = email,
                CreatedAt = DateTime.UtcNow
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, req.Password);

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "User registered successfully" });
        }

        // ==========================================
        // ✅ LOGIN (Password check + OTP email send)
        // POST: api/auth/login
        // ==========================================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            if (req == null ||
                string.IsNullOrWhiteSpace(req.Email) ||
                string.IsNullOrWhiteSpace(req.Password))
            {
                return BadRequest(new { message = "Email and Password are required" });
            }

            var email = NormalizeEmail(req.Email);

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

            // ✅ Prevent user enumeration (security)
            if (user == null)
            {
                return Ok(new
                {
                    message = "If the account exists, an OTP was sent",
                    otpSent = false
                });
            }

            var verify = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, req.Password);

            if (verify == PasswordVerificationResult.Failed)
            {
                return Ok(new
                {
                    message = "If the account exists, an OTP was sent",
                    otpSent = false
                });
            }

            // ✅ Invalidate old OTPs
            await InvalidateOldOtpsAsync(email);

            // ✅ Generate new OTP
            var otp = GenerateOtp();
            var expiryMinutes = 5;

            _db.Otps.Add(new Otp
            {
                Email = email,
                OtpCode = otp,
                ExpiryTime = DateTime.UtcNow.AddMinutes(expiryMinutes),
                IsUsed = false,
                CreatedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();

            //  Send OTP Email
            // If you want HTML template here also, replace with SendEmailAsync()
            await _emailService.SendOtpEmail(email, otp);

            return Ok(new
            {
                message = "OTP sent to email",
                expiryMinutes = expiryMinutes,
                otpSent = true
            });
        }

        // ==========================================
        // ✅ VERIFY OTP (Returns JWT Token)
        // POST: api/auth/verify-otp
        // ==========================================
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest req)
        {
            if (req == null ||
                string.IsNullOrWhiteSpace(req.Email) ||
                string.IsNullOrWhiteSpace(req.Otp))
            {
                return BadRequest(new { message = "Email and OTP are required" });
            }

            var email = NormalizeEmail(req.Email);

            var otpRecord = await _db.Otps
                .Where(o => o.Email == email && o.OtpCode == req.Otp && !o.IsUsed)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync();

            if (otpRecord == null)
                return BadRequest(new { message = "Invalid OTP" });

            if (otpRecord.ExpiryTime < DateTime.UtcNow)
                return BadRequest(new { message = "OTP expired" });

            otpRecord.IsUsed = true;
            await _db.SaveChangesAsync();

            var token = _jwtService.GenerateToken(email);

            return Ok(new
            {
                message = "Login successful ✅",
                token
            });
        }

        // ==========================================
        // ✅ RESEND OTP (HTML email + login link)
        // POST: api/auth/resend-otp
        // ==========================================
        [HttpPost("resend-otp")]
        public async Task<IActionResult> ResendOtp([FromBody] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest(new { message = "Email is required" });

            email = NormalizeEmail(email);

            var userExists = await _db.Users.AnyAsync(u => u.Email == email);
            if (!userExists)
                return BadRequest(new { message = "Email not registered" });

            await InvalidateOldOtpsAsync(email);

            var otp = GenerateOtp();
            var expiryMinutes = 5;

            _db.Otps.Add(new Otp
            {
                Email = email,
                OtpCode = otp,
                ExpiryTime = DateTime.UtcNow.AddMinutes(expiryMinutes),
                IsUsed = false,
                CreatedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();

            // ✅ Frontend login URL
            var frontendBase = _config["Frontend:BaseUrl"] ?? "http://localhost:5173";
            var loginUrl = $"{frontendBase}/verify-otp?email={Uri.EscapeDataString(email)}";

            // ✅ HTML Template Resend OTP Email
            var html = EmailTemplates.ResendOtpEmail(email, otp, loginUrl, expiryMinutes);

            await _emailService.SendEmailAsync(email, "Your New OTP Code", html);

            return Ok(new { message = "OTP resent successfully" });
        }

        // ==========================================
        // ✅ MAGIC LINK SEND
        // POST: api/auth/magic/send
        // ==========================================
        [HttpPost("magic/send")]
        public async Task<IActionResult> SendMagicLink([FromBody] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest(new { message = "Email is required" });

            email = NormalizeEmail(email);

            var userExists = await _db.Users.AnyAsync(u => u.Email == email);
            if (!userExists)
                return BadRequest(new { message = "Email not registered" });

            var token = Guid.NewGuid().ToString("N");
            var expiryMinutes = 10;

            _db.MagicLinks.Add(new MagicLink
            {
                Email = email,
                Token = token,
                ExpiryTime = DateTime.UtcNow.AddMinutes(expiryMinutes),
                IsUsed = false,
                CreatedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();

            var frontendBase = _config["Frontend:BaseUrl"] ?? "http://localhost:5173";
            var magicUrl = $"{frontendBase}/magic-login?token={token}";

            var html = EmailTemplates.MagicLinkEmail(email, magicUrl, expiryMinutes);

            await _emailService.SendEmailAsync(email, "Your Magic Login Link", html);

            return Ok(new { message = "Magic login link sent" });
        }

        // ==========================================
        // ✅ MAGIC LINK VERIFY (Returns JWT)
        // GET: api/auth/magic/verify?token=xxxx
        // ==========================================
        [HttpGet("magic/verify")]
        public async Task<IActionResult> VerifyMagicLink([FromQuery] string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return BadRequest(new { message = "Token is required" });

            var record = await _db.MagicLinks
                .Where(m => m.Token == token && !m.IsUsed)
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefaultAsync();

            if (record == null)
                return BadRequest(new { message = "Invalid token" });

            if (record.ExpiryTime < DateTime.UtcNow)
                return BadRequest(new { message = "Token expired" });

            record.IsUsed = true;
            await _db.SaveChangesAsync();

            var jwt = _jwtService.GenerateToken(record.Email);

            return Ok(new
            {
                message = "Login successful ✅",
                token = jwt
            });
        }

        // ================================
        // ✅ HELPERS
        // ================================
        private static string NormalizeEmail(string email)
            => email.Trim().ToLowerInvariant();

        private static string GenerateOtp()
            => RandomNumberGenerator.GetInt32(100000, 1000000).ToString();

        private async Task InvalidateOldOtpsAsync(string email)
        {
            var activeOtps = await _db.Otps
                .Where(o => o.Email == email && !o.IsUsed)
                .ToListAsync();

            if (activeOtps.Count == 0) return;

            foreach (var otp in activeOtps)
                otp.IsUsed = true;

            await _db.SaveChangesAsync(); // ✅ important
        }
    }
}
