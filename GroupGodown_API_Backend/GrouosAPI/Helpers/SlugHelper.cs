using System.Text.RegularExpressions;

namespace GrouosAPI.Helpers
{
    public static class SlugHelper
    {
        public static string GenerateSlug(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
            {
                return string.Empty;
            }

            // Convert to lowercase
            string slug = title.ToLowerInvariant();

            // Remove invalid characters
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");

            // Replace spaces with hyphens
            slug = Regex.Replace(slug, @"\s+", "-").Trim();

            // Remove any consecutive hyphens
            slug = Regex.Replace(slug, @"-+", "-");

            return slug;
        }
    }
}
