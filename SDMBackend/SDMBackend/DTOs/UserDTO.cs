namespace SDMBackend.DTOs
{
    public class UserDTO
    {
        public int UserID { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!; // Admin / Developer
        public int? DeveloperID { get; set; } // null for Admin
    }
}
