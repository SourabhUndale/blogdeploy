namespace GrouosAPI.Models.DTO
{
    public class AddAdminDto
    {
        public string FullName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public long Phno { get; set; }
        public string Email { get; set; }        
        public string Password { get; set; }
    }
}
