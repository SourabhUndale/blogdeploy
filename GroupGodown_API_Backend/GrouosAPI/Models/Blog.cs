using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GrouosAPI.Models
{
    public class Blog
    {
        [Key] // Indicates that this property is the primary key
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [StringLength(100, ErrorMessage = "Title cannot be longer than 100 characters.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters.")]
        public string Description { get; set; }

        [StringLength(160, ErrorMessage = "Meta description cannot be longer than 160 characters.")]
        public string? MetaDescription { get; set; } // SEO meta description

        [DataType(DataType.Date)]
        public DateTime Date { get; set; } = DateTime.Now; // Default to current date

        [Url(ErrorMessage = "Invalid image URL.")]
        public string? Image { get; set; } // Nullable if not always provided

        [StringLength(255, ErrorMessage = "Alt text cannot be longer than 255 characters.")]
        public string? AltText { get; set; } // Alt text for image accessibility
        public bool isActive { get; set; } = true;

        //[NotMapped]
        //public byte[] ImageCon { get; set; } // Nullable if not always provided
    }
}