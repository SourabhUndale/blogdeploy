using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GrouosAPI.Models
{
    public class Groups
    {
        [Key]
        public int groupId { get; set; }
        public string groupName { get; set; }
        public string groupLink { get; set; }
        public string country { get; set; }       
        public string Language { get; set; }
        public string? groupDesc { get; set; }
        public string? groupRules { get; set; }
        public string? tags { get; set; }

        public string GroupImage { get; set; }

        [DefaultValue("false")]
        public bool Pin { get; set; }
        public bool isActive { get; set; } = true;
        //One TO Many
        public int catId { get; set; }
        public Category Category { get; set; }


        //One TO Many
        public int appId { get; set; }
        public Application Application { get; set; }

        //Many To One

        public List<Report> Reports { get; set;}
    }
}
