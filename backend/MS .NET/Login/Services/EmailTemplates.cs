namespace Login.Services
{
    public class EmailTemplates
    {
        public static string OtpEmail(string email, string otp, string loginUrl, int expiryMinutes)
        {
            return $@"
<!doctype html>
<html>
<head>
  <meta charset='utf-8'/>
  <meta name='viewport' content='width=device-width, initial-scale=1'/>
  <title>Login OTP</title>
</head>
<body style='margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;'>
  <table width='100%' cellpadding='0' cellspacing='0' style='padding:24px 0;'>
    <tr>
      <td align='center'>
        <table width='600' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.08);'>
          <tr>
            <td style='padding:20px 24px;background:#111827;color:#fff;'>
              <h2 style='margin:0;font-size:18px;'>Secure Login Verification</h2>
              <p style='margin:6px 0 0;font-size:13px;color:#cbd5e1;'>OTP verification required</p>
            </td>
          </tr>

          <tr>
            <td style='padding:24px;'>
              <p style='margin:0 0 10px;font-size:14px;color:#111827;'>
                Hello,
              </p>

              <p style='margin:0 0 16px;font-size:14px;color:#111827;'>
                Use the OTP below to complete your login for <b>{email}</b>.
              </p>

              <div style='padding:16px;border:1px dashed #d1d5db;border-radius:10px;text-align:center;margin:18px 0;'>
                <div style='font-size:12px;color:#6b7280;margin-bottom:6px;'>Your One-Time Password (OTP)</div>
                <div style='font-size:28px;font-weight:700;letter-spacing:6px;color:#111827;'>
                  {otp}
                </div>
                <div style='font-size:12px;color:#6b7280;margin-top:8px;'>
                  Valid for <b>{expiryMinutes} minutes</b>
                </div>
              </div>

              <p style='margin:0 0 14px;font-size:14px;color:#111827;'>
                Click the button below to go to the OTP verification page:
              </p>

              <div style='text-align:center;margin:22px 0;'>
                <a href='{loginUrl}'
                   style='display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-size:14px;font-weight:600;'>
                  Go to Login
                </a>
              </div>

              <p style='margin:0;font-size:12px;color:#6b7280;'>
                If you did not request this login, ignore this email. Do not share the OTP with anyone.
              </p>

              <p style='margin:14px 0 0;font-size:12px;color:#6b7280;'>
                Link not working? Copy and paste this into your browser:
                <br/>
                <span style='word-break:break-all;color:#2563eb;'>{loginUrl}</span>
              </p>
            </td>
          </tr>

          <tr>
            <td style='padding:14px 24px;background:#f3f4f6;font-size:11px;color:#6b7280;'>
              This is an automated message. Please do not reply.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>";
        }

        public static string ResendOtpEmail(string email, string otp, string loginUrl, int expiryMinutes)
        {
            return $@"
<!doctype html>
<html>
<head><meta charset='utf-8'/></head>
<body style='font-family:Arial;background:#f6f7fb;padding:20px;'>
  <div style='max-width:600px;margin:auto;background:#fff;border-radius:12px;padding:20px;border:1px solid #eee;'>
    <h2 style='margin:0 0 10px;'>Resent OTP Code</h2>
    <p style='margin:0 0 12px;'>Here is your new OTP for <b>{email}</b>:</p>
    <div style='font-size:26px;font-weight:bold;letter-spacing:6px;margin:16px 0;'>{otp}</div>
    <p style='margin:0 0 14px;'>Valid for <b>{expiryMinutes} minutes</b>.</p>

    <a href='{loginUrl}' style='background:#2563eb;color:#fff;padding:10px 16px;border-radius:10px;text-decoration:none;display:inline-block;'>
      Verify OTP
    </a>

    <p style='margin:16px 0 0;font-size:12px;color:#6b7280;'>
      If you did not request, ignore this email.
    </p>
  </div>
</body>
</html>";
        }

        public static string MagicLinkEmail(string email, string magicLinkUrl, int expiryMinutes)
        {
            return $@"
<!doctype html>
<html>
<head><meta charset='utf-8'/></head>
<body style='font-family:Arial;background:#f6f7fb;padding:20px;'>
  <div style='max-width:600px;margin:auto;background:#fff;border-radius:12px;padding:20px;border:1px solid #eee;'>
    <h2 style='margin:0 0 10px;'>Magic Login Link</h2>
    <p style='margin:0 0 12px;'>
      Click the button to securely login as <b>{email}</b>.
    </p>

    <div style='margin:18px 0;'>
      <a href='{magicLinkUrl}' style='background:#16a34a;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block;'>
        Login Now
      </a>
    </div>

    <p style='margin:0;font-size:12px;color:#6b7280;'>
      This link expires in <b>{expiryMinutes} minutes</b>. If you did not request it, ignore this email.
    </p>

    <p style='margin:14px 0 0;font-size:12px;color:#6b7280;'>
      Copy link:
      <br/>
      <span style='word-break:break-all;color:#16a34a;'>{magicLinkUrl}</span>
    </p>
  </div>
</body>
</html>";
        }
    
    }
}
