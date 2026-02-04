namespace SDMBackend.DTOs
{
    public class DeveloperDTO
    {
        public int DeveloperID { get; set; }
        public int UserID { get; set; }

        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;

        public int Experience { get; set; }
    }
}
