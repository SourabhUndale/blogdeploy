using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GrouosAPI.Models.DTO;
using GrouosAPI.Data;
using GrouosAPI.Models;
using GrouosAPI.Interface;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;

namespace GrouosAPI.Repository
{
    public class BlogRepository : IBlogRepository
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BlogRepository(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
        }

        private string GetBaseUrl()
        {
            var request = _httpContextAccessor.HttpContext.Request;
            return $"{request.Scheme}://{request.Host}";
        }

        private BlogResponseDto MapToDto(Blog b)
        {
            return new BlogResponseDto
            {
                Id = b.Id,
                Title = b.Title,
                Description = b.Description,
                MetaDescription = b.MetaDescription,
                ImageUrl = string.IsNullOrEmpty(b.Image) ? null : $"{GetBaseUrl()}/images/{b.Image}",
                ThumbnailUrl = string.IsNullOrEmpty(b.Image) ? null :
                    $"{GetBaseUrl()}/images/{Path.GetFileNameWithoutExtension(b.Image)}_thumb{Path.GetExtension(b.Image)}",
                AltText = b.AltText,
                Date = b.Date
            };
        }

        // ✅ Always fetch fresh from DB (no caching here)
        public async Task<PagedBlogResponseDto> GetPagedBlogsAsync(int page, int pageSize, CancellationToken cancellationToken = default)
        {
            var query = _dbContext.Blogs.Where(b => b.isActive == true).AsNoTracking();

            var totalCount = await query.CountAsync(cancellationToken);

            var list = await query
                .OrderByDescending(b => b.Date)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            var blogDtos = list.Select(MapToDto).ToList();

            return new PagedBlogResponseDto
            {
                Blogs = blogDtos,
                TotalCount = totalCount
            };
        }

        public async Task<BlogResponseDto> GetBlogByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var blog = await _dbContext.Blogs.Where(b => b.isActive == true)
                .AsNoTracking()
                .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

            return blog == null ? null : MapToDto(blog);
        }

        // public async Task<BlogResponseDto> GetBlogByTitleAsync(string title, CancellationToken cancellationToken)
        // {
        //     var blog = await _dbContext.Blogs
        //         .AsNoTracking()
        //         .FirstOrDefaultAsync(b => b.Title == title, cancellationToken);

        //     return blog == null ? null : MapToDto(blog);
        // }

        public async Task<BlogResponseDto> GetBlogByTitleAsync(string title, CancellationToken cancellationToken)
        {
            title = title?.Trim(); // 🔑 normalize
        
            var blog = await _dbContext.Blogs.Where(b => b.isActive == true)
                .AsNoTracking()
                .FirstOrDefaultAsync(b => b.Title == title, cancellationToken); // ✅ keep case-sensitive
        
            return blog == null ? null : MapToDto(blog);
        }


        public async Task<Blog> AddBlogAsync(BlogDto blogDto, CancellationToken cancellationToken = default)
        {
            var blog = new Blog
            {
                Title = blogDto.Title,
                Description = blogDto.Description,
                MetaDescription = blogDto.MetaDescription,
                Date = blogDto.Date,
                Image = blogDto.Image,
                AltText = blogDto.AltText
            };

            _dbContext.Blogs.Add(blog);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return blog;
        }

        public async Task<Blog> UpdateBlogAsync(int id, BlogDto blogDto, CancellationToken cancellationToken = default)
        {
            var existingBlog = await _dbContext.Blogs.FindAsync(new object[] { id }, cancellationToken);
            if (existingBlog == null) return null;

            existingBlog.Title = blogDto.Title;
            existingBlog.Description = blogDto.Description;
            existingBlog.MetaDescription = blogDto.MetaDescription;
            existingBlog.Date = blogDto.Date;
            existingBlog.AltText = blogDto.AltText;

            if (!string.IsNullOrEmpty(blogDto.Image))
                existingBlog.Image = blogDto.Image;

            await _dbContext.SaveChangesAsync(cancellationToken);
            return existingBlog;
        }

        public async Task<bool> DeleteBlogAsync(int id, CancellationToken cancellationToken = default)
        {
            var existingBlog = await _dbContext.Blogs.FindAsync(new object[] { id }, cancellationToken);
            if (existingBlog == null) return false;

            existingBlog.isActive = false;
            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
