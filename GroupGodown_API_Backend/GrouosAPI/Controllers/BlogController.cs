using Microsoft.AspNetCore.Mvc;
using GrouosAPI.Models.DTO;
using GrouosAPI.Interface;
using GrouosAPI.Helpers;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace GrouosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IBlogRepository _blogRepository;
        private readonly string _imageFolderPath;

        public BlogController(IBlogRepository blogRepository, IConfiguration configuration)
        {
            _blogRepository = blogRepository;
            _imageFolderPath = configuration["ImageFolderPath"] ?? "wwwroot/images"; // Use configuration
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBlogs(CancellationToken cancellationToken)
        {
            var blogs = await _blogRepository.GetAllBlogsAsync(cancellationToken);
            return Ok(blogs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBlogById(int id, CancellationToken cancellationToken)
        {
            var blog = await _blogRepository.GetBlogByIdAsync(id, cancellationToken);
            if (blog == null)
            {
                return NotFound(new { Message = "Blog not found." });
            }
            return Ok(blog);
        }
        [HttpPost]
        public async Task<IActionResult> AddBlog([FromForm] BlogDto blogDto, CancellationToken cancellationToken)
        {
            Console.WriteLine($"Received Payload: {JsonConvert.SerializeObject(blogDto)}");
            if (!ModelState.IsValid) // Validate model state
                return BadRequest(ModelState);

            try
            {
                if (blogDto.ImageFile != null)
                {
                    blogDto.Image = await FileHelper.SaveImageAsync(blogDto.ImageFile, _imageFolderPath);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error saving image.", Details = ex.Message });
            }

            var blog = await _blogRepository.AddBlogAsync(blogDto, cancellationToken);

            // Check for null response from repository
            if (blog == null)
            {
                Console.WriteLine("Failed to add the blog.");
                return BadRequest(new { Message = "Failed to add the blog." });
            }

            Console.WriteLine($"Blog successfully added: {JsonConvert.SerializeObject(blog)}");
            return CreatedAtAction(nameof(GetBlogById), new { id = blog.Id }, blog);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlog(int id, [FromForm] BlogDto blogDto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid) // Validate model state
                return BadRequest(ModelState);

            var existingBlog = await _blogRepository.GetBlogByIdAsync(id, cancellationToken);
            if (existingBlog == null)
            {
                return NotFound(new { Message = "Blog not found." });
            }

            if (blogDto.ImageFile != null)
            {
                if (!string.IsNullOrEmpty(existingBlog.Image))
                {
                    await FileHelper.DeleteImageAsync(_imageFolderPath, existingBlog.Image); // Await async call
                }
                blogDto.Image = await FileHelper.SaveImageAsync(blogDto.ImageFile, _imageFolderPath);
            }

            var updatedBlog = await _blogRepository.UpdateBlogAsync(id, blogDto, cancellationToken);
            if (updatedBlog == null)
            {
                return BadRequest(new { Message = "Failed to update the blog." });
            }

            return Ok(updatedBlog);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlog(int id, CancellationToken cancellationToken)
        {
            var existingBlog = await _blogRepository.GetBlogByIdAsync(id, cancellationToken);
            if (existingBlog == null)
            {
                return NotFound(new { Message = "Blog not found." });
            }

            if (!string.IsNullOrEmpty(existingBlog.Image))
            {
                await FileHelper.DeleteImageAsync(_imageFolderPath, existingBlog.Image); // Await async call
            }

            var success = await _blogRepository.DeleteBlogAsync(id, cancellationToken);
            if (!success)
            {
                return BadRequest(new { Message = "Failed to delete the blog." });
            }

            return NoContent();
        }
    }
}