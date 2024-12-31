namespace GrouosAPI.Models.DTO
{
    public class GroupDto
    {
        public int groupId { get; set; }
        public string groupName { get; set; }
        public string groupLink { get; set; }
        public string GroupImage { get; set; }
        public string catName { get; set; }
        public int? catId {get; set;}
        public string country { get; set; }
        public string Language { get; set; }
        public string? groupDesc { get; set; }
        public string? groupRules { get; set; }
        public string? tags { get; set; }
        public string? message { get; set; }

    }
}
