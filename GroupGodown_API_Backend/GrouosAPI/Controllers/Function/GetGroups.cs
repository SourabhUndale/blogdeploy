using GrouosAPI.Data;
using GrouosAPI.Models;
using GrouosAPI.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace GrouosAPI.Controllers.Function
{
    public class GetGroups
    {
        private readonly DataContext _context;

        public GetGroups(DataContext context)
        {
            _context = context;
        }
        public  ICollection<GroupDto> ListGroupDto(List<Groups> groups)
        {
            var groupDto = new List<GroupDto>();
            var category = new Category();


            foreach (var group in groups)
            {
                category = _context.Category.Where(x => x.catId == group.catId).FirstOrDefault();
                groupDto.Add(new GroupDto()
                {
                    groupId = group.groupId,
                    groupName = group.groupName,
                    GroupImage = group.GroupImage,
                    Category = new CategoryDto { catId = category.catId, catName = category.catName },
                    groupDesc = group.groupDesc,
                    groupLink = group.groupLink,
                    groupRules = group.groupRules,
                    country = group.country,
                    Language = group.Language,
                    tags = group.tags
                });

            }
            return groupDto;
        }
    }
}
