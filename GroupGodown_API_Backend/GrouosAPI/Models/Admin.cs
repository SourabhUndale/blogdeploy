using System.ComponentModel.DataAnnotations;

namespace GrouosAPI.Models
{
    public class Admin
    {
        [Key]
        public Guid AdminId { get; set; }
        public string FullName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public long Phno { get; set; }
        public string Email { get; set; }
        [MinLength(8), MaxLength(16)]
        public string Password { get; set; }
    }
}
