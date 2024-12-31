//using Microsoft.AspNetCore.Http;
//using System;
//using System.ComponentModel.DataAnnotations;

//namespace GrouosAPI.Models.DTO
//{
//    public class BlogDto
//    {
//        public int Id { get; set; }

//        [Required(ErrorMessage = "Title is required.")]
//        [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
//        public string Title { get; set; }

//        [Required(ErrorMessage = "Description is required.")]
//        [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
//        public string Description { get; set; }

//        public DateTime Date { get; set; } = DateTime.UtcNow; // Default to current UTC time

//        [FileExtensions(Extensions = "jpg,jpeg,png,gif", ErrorMessage = "Please upload a valid image file.")]
//        public IFormFile? ImageFile { get; set; } // Nullable in case the image file is optional
//        [StringLength(255, ErrorMessage = "Image path cannot exceed 255 characters.")]
//        public string? Image { get; set; } // Nullable to handle cases without an image
//    }
//}



using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace GrouosAPI.Models.DTO
{
    public class BlogDto
    {
        ////[Required(ErrorMessage = "Title is required.")]
        //[StringLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
        //public string Title { get; set; }

        ////[Required(ErrorMessage = "Description is required.")]
        //[StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
        //public string Description { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public IFormFile? ImageFile { get; set; } // Nullable if not always provided

        [Url(ErrorMessage = "Invalid image URL format.")]
        public string? Image { get; set; } // Nullable if not always provided

        public DateTime Date { get; set; } = DateTime.UtcNow; // Use UTC for consistency
    }
}


//using System.ComponentModel.DataAnnotations;
//public class BlogDto
//{
//    [Required]
//    [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
//    public string Title { get; set; }

//    [Required]
//    [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters.")]
//    public string Description { get; set; }

//    [Required]
//    public DateTime Date { get; set; }

//    [Required]
//    public IFormFile? ImageFile { get; set; }
//}
