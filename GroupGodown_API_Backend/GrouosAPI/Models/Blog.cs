// File: Blog.cs
//using System.ComponentModel.DataAnnotations;

//namespace GrouosAPI.Models
//{
//    public class Blog
//    {
//        public int Id { get; set; }
//        public string Title { get; set; }
//        public string Description { get; set; }
//        public string ImageUrl { get; set; }
//        public DateTime PublishDate { get; set; }
//    }
//}
// File: Blog.cs
// File: Blog.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Blog
{
    [Key] // Indicates that this property is the primary key
    public int Id { get; set; }

    [Required(ErrorMessage = "Title is required.")]
    [StringLength(100, ErrorMessage = "Title cannot be longer than 100 characters.")]
    public string Title { get; set; }

    [Required(ErrorMessage = "Description is required.")]
    //[StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters.")]
    public string Description { get; set; }

    [DataType(DataType.Date)]
    public DateTime Date { get; set; } = DateTime.Now; // Default to current date

    [Url(ErrorMessage = "Invalid image URL.")]
    public string? Image { get; set; } // Nullable if not always provided

    [NotMapped]
    public byte[] ImageCon { get; set; } // Nullable if not always provided
}