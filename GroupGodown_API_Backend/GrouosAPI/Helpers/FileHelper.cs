using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace GrouosAPI.Helpers
{
    public static class FileHelper
    {
        private static readonly string[] ValidImageExtensions = { ".jpg", ".jpeg", ".png", ".gif" };

        public static async Task<string> SaveImageAsync(IFormFile imageFile, string folderPath)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                throw new ArgumentException("Image file is not valid.");
            }

            // Validate file extension
            var extension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
            if (!Array.Exists(ValidImageExtensions, e => e.Equals(extension)))
            {
                throw new ArgumentException("Invalid image format.");
            }

            var imageName = $"{Guid.NewGuid()}{extension}";
            var imagePath = Path.Combine(folderPath, imageName);

            try
            {
                Directory.CreateDirectory(folderPath); // Ensure directory exists

                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }

                return imageName; // Consider returning full path or URL if needed
            }
            catch (Exception ex)
            {
                // Log exception (consider using a logging framework)
                throw new IOException("Failed to save the image.", ex);
            }
        }

        public static async Task<bool> DeleteImageAsync(string folderPath, string imageName)
        {
            var fullPath = Path.Combine(folderPath, imageName);
            if (File.Exists(fullPath))
            {
                try
                {
                    File.Delete(fullPath);
                    return await Task.FromResult(true);
                }
                catch (Exception ex)
                {
                    // Log exception (consider using a logging framework)
                    throw new IOException("Failed to delete the image.", ex);
                }
            }
            return false; // Return false if file does not exist
        }
    }
}