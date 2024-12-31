using System.ComponentModel.DataAnnotations;

namespace GrouosAPI.Models
{
    public class Report
    {
        [Key]
        public int ReportId { get; set; }
        public string ReportReason { get; set; }
        public string ReportDesc { get; set; }

        //One to Many
        public int GroupId { get; set; }
        public Groups Group { get; set; }
    }
}
