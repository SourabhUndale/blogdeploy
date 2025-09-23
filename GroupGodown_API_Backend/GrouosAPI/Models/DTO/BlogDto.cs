using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace GrouosAPI.Models.DTO
{
    public class BlogDto
    {
        
        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }
        
        public string? MetaDescription { get; set; } // SEO meta description

        public IFormFile? ImageFile { get; set; } // Nullable if not always provided

        [Url(ErrorMessage = "Invalid image URL format.")]
        public string? Image { get; set; } // Nullable if not always provided
        
        [StringLength(255, ErrorMessage = "Alt text cannot be longer than 255 characters.")]
        public string? AltText { get; set; } // Alt text for image accessibility

        public DateTime Date { get; set; } = DateTime.UtcNow; // Use UTC for consistency
    }
}

