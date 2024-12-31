using System.ComponentModel.DataAnnotations;

namespace GrouosAPI.Models
{
    public class Application
    {
        [Key]
        public int appId { get; set; }
        [Required]
        public string appName { get; set; }
        public ICollection<Groups> groups { get; set; }
    }
}
