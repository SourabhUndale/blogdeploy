using System;

namespace GrouosAPI.Models.DTO
{
    public class BlogResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string? MetaDescription { get; set; }
        public string? ImageUrl { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? AltText { get; set; }
        public DateTime Date { get; set; }
    }
}
