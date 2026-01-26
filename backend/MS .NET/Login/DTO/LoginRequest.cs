using System.ComponentModel.DataAnnotations;

namespace Login.DTO
{
    public class LoginRequest
    {
      
        //[EmailAddress] // remove if Username is NOT an email
        [Required]
        public string Email { get; set; } = string.Empty;
        //public string Username { get; set; }

        [Required]
        public string Password { get; set; }
       
        

    }
}
