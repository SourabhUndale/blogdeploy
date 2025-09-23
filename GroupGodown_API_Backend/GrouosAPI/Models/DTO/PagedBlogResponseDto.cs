using System.Collections.Generic;

namespace GrouosAPI.Models.DTO
{
    public class PagedBlogResponseDto
    {
        public IEnumerable<BlogResponseDto> Blogs { get; set; }
        public int TotalCount { get; set; }
    }
}
