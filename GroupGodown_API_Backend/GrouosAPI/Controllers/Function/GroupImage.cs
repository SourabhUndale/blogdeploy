using System.Xml;
using GrouosAPI.Models.DTO;
using HtmlAgilityPack;
namespace GrouosAPI.Controllers.Function
{
    public class GroupImage
    {
        public  static GroupData GetImageAndName(string url)
        {
            try
            {
                HtmlWeb web = new HtmlWeb();
                HtmlDocument doc = new HtmlDocument();
                doc = web.Load(url);
                string h3Value = "";
                string src = null;

                HtmlNode h3Node = doc.DocumentNode.SelectSingleNode("//*[@id=\"main_block\"]/h3");

                if (h3Node != null)
                {
                    h3Value = h3Node.InnerText.Trim();
                    //Console.WriteLine("Value of <h3>: " + h3Value);
                }

                // Fetch image elements with the specified class (_9vx6)
                var imageElements = doc.DocumentNode.SelectNodes("//*[@id=\"action-icon\"]/span/img");

                // Log the src attribute of each image element
                if (imageElements != null)
                {
                    foreach (var element in imageElements)
                    {
                        src = element.Attributes["src"].Value;
                        src = System.Net.WebUtility.HtmlDecode(src);
                        //Console.WriteLine($"Image Source: {src}");
                    }
                }
                if (h3Value != "" && src != null)
                {
                    GroupData groupData = new GroupData
                    {
                        GroupName = h3Value,
                        ImageLink = src
                    };
                    return groupData;
                }
            }
            catch (Exception ex)
            {
                //Console.Error.WriteLine($"Error during fetch operation: {ex.Message}");
                return null;
            }
            return null;
        }
    }
}
