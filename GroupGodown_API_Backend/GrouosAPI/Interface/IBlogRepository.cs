using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GrouosAPI.Models.DTO;
using GrouosAPI.Models;

namespace GrouosAPI.Interface
{
    public interface IBlogRepository
{
    /// <summary>
    /// Retrieves all blogs asynchronously.
    /// </summary>
    /// <returns>A collection of blogs.</returns>
    Task<PagedBlogResponseDto> GetPagedBlogsAsync(int page, int pageSize, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a blog by its ID asynchronously.
    /// </summary>
    /// <param name="id">The ID of the blog.</param>
    /// <returns>The blog with the specified ID.</returns>
    Task<BlogResponseDto> GetBlogByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds a new blog asynchronously.
    /// </summary>
    /// <param name="blogDto">The DTO containing blog details.</param>
    /// <returns>The added blog.</returns>
    Task<Blog> AddBlogAsync(BlogDto blogDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing blog asynchronously.
    /// </summary>
    /// <param name="id">The ID of the blog to update.</param>
    /// <param name="blogDto">The DTO containing updated blog details.</param>
    /// <returns>The updated blog.</returns>
    Task<Blog> UpdateBlogAsync(int id, BlogDto blogDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a blog by its ID asynchronously.
    /// </summary>
    /// <param name="id">The ID of the blog to delete.</param>
    /// <returns>True if the deletion was successful; otherwise, false.</returns>
    Task<bool> DeleteBlogAsync(int id, CancellationToken cancellationToken = default);

    Task<BlogResponseDto> GetBlogByTitleAsync(string title, CancellationToken cancellationToken);
    }
}
