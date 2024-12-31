using System.ComponentModel.DataAnnotations;

namespace GrouosAPI.Models
{
    public class Category
    {
        [Key]
        public int catId { get; set; }
        [Required]
        public string catName { get; set; }
        public ICollection<Groups> groups { get; set; }
    }
}
