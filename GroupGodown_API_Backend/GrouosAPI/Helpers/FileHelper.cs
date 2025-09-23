using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;

namespace GrouosAPI.Helpers
{
    public static class FileHelper
    {
        private static readonly string[] ValidImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

        public static async Task<(string original, string thumbnail)> SaveImageWithThumbnailAsync(IFormFile imageFile, string folderPath, int thumbnailWidth = 300)
        {
            if (imageFile == null || imageFile.Length == 0)
                throw new ArgumentException("Image file is not valid.");

            var extension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
            if (!Array.Exists(ValidImageExtensions, e => e.Equals(extension)))
                throw new ArgumentException("Invalid image format.");

            var originalName = $"{Guid.NewGuid()}{extension}";
            var thumbName = $"{Path.GetFileNameWithoutExtension(originalName)}_thumb{extension}";

            var originalPath = Path.Combine(folderPath, originalName);
            var thumbPath = Path.Combine(folderPath, thumbName);

            Directory.CreateDirectory(folderPath);

            try
            {
                // Save original
                using (var stream = new FileStream(originalPath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }

                // Create thumbnail using ImageSharp
                using (var image = await Image.LoadAsync(originalPath))
                {
                    int newHeight = (int)(image.Height * (thumbnailWidth / (float)image.Width));
                    image.Mutate(x => x.Resize(thumbnailWidth, newHeight));

                    await image.SaveAsync(thumbPath, new JpegEncoder { Quality = 80 });
                }

                return (originalName, thumbName);
            }
            catch (Exception ex)
            {
                throw new IOException("Failed to save image and thumbnail.", ex);
            }
        }

        public static async Task<bool> DeleteImageAsync(string folderPath, string imageName)
        {
            if (string.IsNullOrWhiteSpace(imageName))
                return false;

            var originalPath = Path.Combine(folderPath, imageName);
            var thumbPath = Path.Combine(folderPath, Path.GetFileNameWithoutExtension(imageName) + "_thumb" + Path.GetExtension(imageName));

            try
            {
                if (File.Exists(originalPath)) File.Delete(originalPath);
                if (File.Exists(thumbPath)) File.Delete(thumbPath);
                return await Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new IOException("Failed to delete the image or thumbnail.", ex);
            }
        }
    }
}

