using Microsoft.AspNetCore.Mvc;
using GrouosAPI.Models.DTO;
using GrouosAPI.Interface;
using GrouosAPI.Helpers;
using Microsoft.Extensions.Caching.Memory;

namespace GrouosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IBlogRepository _blogRepository;
        private readonly IMemoryCache _cache;
        private readonly ILogger<BlogController> _logger;

        private const string CacheKeyPrefix = "blogs_page_";
        private const string CacheBlogPrefix = "blog_";

        public BlogController(IBlogRepository blogRepository, IMemoryCache cache, ILogger<BlogController> logger)
        {
            _blogRepository = blogRepository;
            _cache = cache;
            _logger = logger;
        }

        private void InvalidateCache()
        {
            // ✅ Flush the entire memory cache (since only blogs are cached)
            (_cache as MemoryCache)?.Compact(1.0);
        }

        // ✅ Get all blogs with pagination (cached)
        [HttpGet]
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
        public async Task<IActionResult> GetAllBlogs([FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var cacheKey = $"{CacheKeyPrefix}{page}_{pageSize}";
            if (!_cache.TryGetValue(cacheKey, out var blogs))
            {
                blogs = await _blogRepository.GetPagedBlogsAsync(page, pageSize, cancellationToken);

                _cache.Set(cacheKey, blogs, new MemoryCacheEntryOptions
                {
                    SlidingExpiration = TimeSpan.FromMinutes(2),
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                });
            }

            return Ok(blogs);
        }

        // ✅ Get blog by ID
        [HttpGet("{id}")]
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
        public async Task<IActionResult> GetBlogById(int id, CancellationToken cancellationToken)
        {
            var cacheKey = $"{CacheBlogPrefix}{id}";
            if (!_cache.TryGetValue(cacheKey, out var blog))
            {
                blog = await _blogRepository.GetBlogByIdAsync(id, cancellationToken);
                if (blog == null) return NotFound(new { Message = "Blog not found." });

                _cache.Set(cacheKey, blog, TimeSpan.FromMinutes(10));
            }
            return Ok(blog);
        }

       
       
        // Add Blog
        [HttpPost]
        public async Task<IActionResult> AddBlog([FromForm] BlogDto blogDto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            blogDto.Title = blogDto.Title?.Trim(); // 🔑 remove starting/ending spaces
            if (string.IsNullOrWhiteSpace(blogDto.Title))
                return BadRequest(new { Message = "Title cannot be empty or whitespace." });

            if (blogDto.ImageFile != null)
            {
                var (original, _) = await FileHelper.SaveImageWithThumbnailAsync(blogDto.ImageFile, "wwwroot/images");
                blogDto.Image = original;
            }

            var blog = await _blogRepository.AddBlogAsync(blogDto, cancellationToken);
            InvalidateCache();

            return CreatedAtAction(nameof(GetBlogById), new { id = blog.Id }, blog);
        }

        // Update Blog
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlog(int id, [FromForm] BlogDto blogDto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            blogDto.Title = blogDto.Title?.Trim(); // 🔑 normalize
            if (string.IsNullOrWhiteSpace(blogDto.Title))
                return BadRequest(new { Message = "Title cannot be empty or whitespace." });

            var existingBlog = await _blogRepository.GetBlogByIdAsync(id, cancellationToken);
            if (existingBlog == null)
                return NotFound(new { Message = "Blog not found." });

            if (blogDto.ImageFile != null)
            {
                var (original, _) = await FileHelper.SaveImageWithThumbnailAsync(blogDto.ImageFile, "wwwroot/images");
                blogDto.Image = original;
            }

            var updatedBlog = await _blogRepository.UpdateBlogAsync(id, blogDto, cancellationToken);
            InvalidateCache();

            return Ok(updatedBlog);
        }

        // Get Blog by Title
        [HttpGet("title/{title}")]
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
        public async Task<IActionResult> GetBlogByTitle(string title, CancellationToken cancellationToken)
        {
            string formattedTitle = title.Replace("-", " ").Trim(); // 🔑 just trim spaces
            var blog = await _blogRepository.GetBlogByTitleAsync(formattedTitle, cancellationToken);

            if (blog == null) return NotFound(new { Message = "Blog not found." });
            return Ok(blog);
        }


        // ✅ Delete blog
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlog(int id, CancellationToken cancellationToken)
        {
            var success = await _blogRepository.DeleteBlogAsync(id, cancellationToken);
            if (!success) return NotFound(new { Message = "Blog not found." });

            InvalidateCache(); // ✅ clear cache after delete

            return NoContent();
        }
    }
}
