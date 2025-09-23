using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace GrouosAPI.Services
{
    public class SearchEnginePingService
    {
        private readonly ILogger<SearchEnginePingService> _logger;
        private readonly HttpClient _httpClient;

        public SearchEnginePingService(ILogger<SearchEnginePingService> logger, HttpClient httpClient)
        {
            _logger = logger;
            _httpClient = httpClient;
        }

        public async Task PingSearchEngines(string sitemapUrl)
        {
            var googlePingUrl = $"https://www.google.com/ping?sitemap={sitemapUrl}";
            var bingPingUrl = $"https://www.bing.com/ping?sitemap={sitemapUrl}";
            var yandexPingUrl = $"https://webmaster.yandex.com/site/map.xml?url={sitemapUrl}";

            await SendPing(googlePingUrl, "Google");
            await SendPing(bingPingUrl, "Bing");
            await SendPing(yandexPingUrl, "Yandex");
        }

        private async Task SendPing(string url, string engineName)
        {
            try
            {
                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();
                _logger.LogInformation($"Successfully pinged {engineName}: {url}");
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, $"Failed to ping {engineName}: {url}. Error: {ex.Message}");
            }
        }
    }
}
