using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GrouosAPI.Models.DTO;
using System;
using GrouosAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace GrouosAPI.Repository
{
    public class BlogRepository : IBlogRepository
    {
        private readonly DataContext DbContext;

        private readonly IConfiguration _configuration;

        public BlogRepository(DataContext dbContext, IConfiguration configuration)
        {
            DbContext = dbContext;
            _configuration = configuration;
        }

        public async Task<IEnumerable<Blog>> GetAllBlogsAsync(CancellationToken cancellationToken = default)
        {
            // Fetch all blogs from the database
            var blogList = await DbContext.Blogs.ToListAsync(cancellationToken);


            // Process each blog and fetch image asynchronously in parallel
            var imageTasks = blogList.Select(async blog =>
            {
                blog.ImageCon = await GetImageAsync(blog.Image);
            }).ToList();

            // Wait for all image fetching tasks to complete
            await Task.WhenAll(imageTasks);

            return blogList;
        }

        public async Task<Blog> GetBlogByIdAsync(int id, CancellationToken cancellationToken = default)
    {
    // Fetch the blog entity by ID
         var blog = await DbContext.Blogs.FindAsync(new object[] { id }, cancellationToken);
         if (blog == null)
    {
        throw new KeyNotFoundException($"Blog with ID {id} not found.");
    }

    // Fetch the image content asynchronously
        blog.ImageCon = await GetImageAsync(blog.Image);

    return blog;
}




        public async Task<Blog> AddBlogAsync(BlogDto blogDto, CancellationToken cancellationToken = default)
        {
            // Map BlogDto to Blog model
            var blog = new Blog
            {
                Title = blogDto.Title,
                Description = blogDto.Description,
                Date = blogDto.Date,
                Image = blogDto.Image
            };

            // Add blog to database
            DbContext.Blogs.Add(blog);
            await DbContext.SaveChangesAsync(cancellationToken);

            return blog;
        }

        public async Task<Blog> UpdateBlogAsync(int id, BlogDto blogDto, CancellationToken cancellationToken = default)
        {
            // Find the existing blog by ID
            var existingBlog = await DbContext.Blogs.FindAsync(new object[] { id }, cancellationToken);
            if (existingBlog == null) return null;

            // Update blog properties
            existingBlog.Title = blogDto.Title;
            existingBlog.Description = blogDto.Description;
            existingBlog.Date = blogDto.Date;
            if (!string.IsNullOrEmpty(blogDto.Image))
            {
                existingBlog.Image = blogDto.Image;
            }

            await DbContext.SaveChangesAsync(cancellationToken);
            return existingBlog;
        }

        public async Task<bool> DeleteBlogAsync(int id, CancellationToken cancellationToken = default)
        {
            // Find the blog by ID
            var existingBlog = await DbContext.Blogs.FindAsync(new object[] { id }, cancellationToken);
            if (existingBlog == null) return false;

            // Remove the blog
            DbContext.Blogs.Remove(existingBlog);
            await DbContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<byte[]> GetImageAsync(string imageName)
        {
            var imageFolderPath = _configuration["ImageSettings:ImageFolderPath"];
            var filePath = Path.Combine(imageFolderPath, imageName);

            
            if (!System.IO.File.Exists(filePath))
            {
                //throw new FileNotFoundException("Image not found.", filePath);
                return null;
            }

            
            return System.IO.File.ReadAllBytes(filePath);
        }


    }
}
