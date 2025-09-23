using Microsoft.AspNetCore.Mvc;
using GrouosAPI.Services;
using System.Xml.Linq;

namespace GrouosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SitemapController : ControllerBase
    {
        private readonly SitemapService _sitemapService;

        public SitemapController(SitemapService sitemapService)
        {
            _sitemapService = sitemapService;
        }

        [HttpGet("content")]
        public IActionResult GetSitemapContent()
        {
            var sitemapXml = _sitemapService.GenerateSitemap();
            return Content(sitemapXml, "application/xml", System.Text.Encoding.UTF8);
        }
    }
}
