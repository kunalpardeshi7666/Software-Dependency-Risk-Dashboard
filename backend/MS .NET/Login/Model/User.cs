namespace Login.Model
{
    public class User
    {

        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        //public string Role { get; set; }

        //public ICollection<RefreshToken> RefreshTokens { get; set; }
    }
}
