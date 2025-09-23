using GrouosAPI.Data;
using GrouosAPI.Models;
using System.Xml.Linq;
using Microsoft.Extensions.Configuration;
using GrouosAPI.Helpers;

namespace GrouosAPI.Services
{
    public class SitemapService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly string _baseUrl;

        public SitemapService(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _baseUrl = _configuration["ApplicationSettings:BaseUrl"];
        }

        public string GenerateSitemap()
        {
            XNamespace ns = "http://www.sitemaps.org/schemas/sitemap/0.9";
            XNamespace xsi = "http://www.w3.org/2001/XMLSchema-instance";
            XDocument sitemap = new XDocument(
                new XDeclaration("1.0", "utf-8", "yes"),
                new XElement(ns + "urlset",
                    new XAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9"),
                    new XAttribute(XNamespace.Xmlns + "xsi", "http://www.w3.org/2001/XMLSchema-instance"),
                    new XAttribute(xsi + "schemaLocation", "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"),
                    new XElement(ns + "url",
                        new XElement(ns + "loc", $"{_baseUrl}/"),
                        new XElement(ns + "lastmod", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ")),
                        new XElement(ns + "changefreq", "daily"),
                        new XElement(ns + "priority", "1.0")
                    ),
                    _context.Groups.Select(g => new XElement(ns + "url",
                        new XElement(ns + "loc", $"{_baseUrl}/groupinvite?id={g.groupId}&catId={g.catId}"),
                        new XElement(ns + "lastmod", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ")),
                        new XElement(ns + "changefreq", "daily"),
                        new XElement(ns + "priority", "0.8")
                    )),
                    _context.Blogs.Select(b => new XElement(ns + "url",
                        new XElement(ns + "loc", $"{_baseUrl}/blog/{SlugHelper.GenerateSlug(b.Title)}"),
                        new XElement(ns + "lastmod", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ")),
                        new XElement(ns + "changefreq", "daily"),
                        new XElement(ns + "priority", "0.8")
                    ))
                )
            );

            return sitemap.ToString();
        }
    }
}
