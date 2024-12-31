using GrouosAPI.Controllers.Function;
using GrouosAPI.Data;
using GrouosAPI.Interface;
using GrouosAPI.Models;
using GrouosAPI.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace GrouosAPI.Repository
{
    public class GroupRepository : IGroupRepository
    {
        private readonly DataContext _context;
        private readonly GetGroups _getGroups;

        public GroupRepository(DataContext context,GetGroups getGroups)
        {
            _context = context;
            _getGroups = getGroups;
        }

        
        public GroupDto existGroup(string groupLink)
        {
            var group = _context.Groups.Where(x => x.groupLink == groupLink).FirstOrDefault();
            if (group != null)
            {
                var category = _context.Category.Where(x => x.catId == group.catId).FirstOrDefault();

                var groupDto = new GroupDto()
                {
                    groupId = group.groupId,
                    groupName = group.groupName,
                    GroupImage = group.GroupImage,
                    catName = category.catName,
                    groupDesc = group.groupDesc,
                    groupLink = group.groupLink,
                    groupRules = group.groupRules,
                    country = group.country,
                    Language = group.Language,
                    tags = group.tags
                };
                return groupDto;
            }
            return null;
        }

        public IQueryable<Groups> GetAll()
        {
            return _context.Groups
                .Include(a => a.Reports)
                .Include(a => a.Category)
                .Include(a => a.Application)
                .AsQueryable();
        }
        public GroupDto GetById(int id)
        {
            //return _context.Groups
            //    .Include(a => a.Reports)
            //    .Include(a => a.Category)
            //    .Include(a => a.Application)
            //    .AsQueryable()
            //    .Where(c => c.groupId == id);

            try
            {
                var group = _context.Groups
                    .Include(a => a.Reports)
                    .Include(a => a.Category)
                    .Include(a => a.Application)
                    .FirstOrDefault(c => c.groupId == id);

                if (group != null)
                {
                    var category = _context.Category.Where(x => x.catId == group.catId).FirstOrDefault();

                    var groupDto = new GroupDto()
                    {
                        groupId = group.groupId,
                        groupName = group.groupName,
                        GroupImage = group.GroupImage,
                        catName = category.catName,
                        groupDesc = group.groupDesc,
                        groupLink = group.groupLink,
                        groupRules = group.groupRules,
                        country = group.country,
                        Language = group.Language,
                        tags = group.tags
                    };
                    return groupDto;
                }                              
            }
            catch (Exception ex)
            {
                return null;
            }
            return null;
        }

        public ICollection<GroupDto> GetGroups()
        {
            var groups = _context.Groups.OrderBy(g => g.groupId).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public Groups GetGroupById(int id)
        {
            return _context.Groups.Find(id);
        }

        public ICollection<GroupDto> GetGroupByAll(int catId, int appId, string country, string lang)
        {
            var groups = _context.Groups.Where(x => x.catId == catId && x.appId == appId && x.Language == lang && x.country == country).ToList();
            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupByCategory(int catId)
        {
            var groups = _context.Groups.Where(x => x.catId == catId).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupByApp(int appId)
        {
            var groups = _context.Groups.Where(x => x.appId == appId).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupByLang(string lang)
        {
            var groups = _context.Groups.Where(x => x.Language == lang).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupByCountry(string country)
        {
            var groups = _context.Groups.Where(x => x.country == country).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupByLangAndCountry(string country, string lang)
        {
            var groups = _context.Groups.Where(x => x.Language == lang && x.country == country).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupByCategoryAndLang(int catId, string lang)
        {
            var groups = _context.Groups.Where(x => x.catId == catId && x.Language == lang).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupByAppAndCategory(int appId, int catId)
        {
            var groups = _context.Groups.Where(x => x.appId == appId && x.catId == catId).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupByAppAndLang(int appId, string lang)
        {
            var groups = _context.Groups.Where(x => x.appId == appId && x.Language == lang).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupByCategoryAndCountry(int catId, string country)
        {
            var groups = _context.Groups.Where(x => x.catId == catId && x.country == country).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupByAppAndCountry(int appId, string country)
        {
            var groups = _context.Groups.Where(x => x.appId == appId && x.country == country).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupByAppAndCountryAndLang(int appId, string country, string lang)
        {
            var groups = _context.Groups.Where(x => x.appId == appId && x.country == country && x.Language == lang).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupByAppAndCategoryAndLang(int appId, int catId, string lang)
        {
            var groups = _context.Groups.Where(x => x.appId == appId && x.catId == catId && x.Language == lang).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupByAppAndCategoryAndCountry(int appId, int catId, string country)
        {
            var groups = _context.Groups.Where(x => x.appId == appId && x.catId == catId && x.country == country).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }
        public ICollection<GroupDto> GetGroupByCategoryAndLangAndCountry(int catId, string country, string lang)
        {
            var groups = _context.Groups.Where(x => x.catId == catId && x.Language == lang && x.country == country).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public GroupDto AddGroup(int catId, int appId, addGroupDto addGroupDto)
        {
            var groupDto = existGroup(addGroupDto.groupLink);
            if (groupDto == null)
            {
                GroupData groupData = GroupImage.GetImageAndName(addGroupDto.groupLink);

                if (groupData != null)
                {
                    var category = _context.Category.Find(catId);
                    var existAppId = _context.Application.Find(appId) != null;
                    if (category != null && existAppId && groupData.ImageLink != null && groupData.GroupName != null)
                    {
                        var group = new Groups
                        {
                            catId = catId,
                            appId = appId,
                            groupName = groupData.GroupName,
                            GroupImage = groupData.ImageLink,
                            groupLink = addGroupDto.groupLink,
                            groupDesc = addGroupDto.groupDesc,
                            groupRules = addGroupDto.groupRules,
                            country = addGroupDto.country,
                            Language = addGroupDto.Language,
                            tags = addGroupDto.tags
                        };

                        _context.Groups.Add(group);
                        _context.SaveChanges();
                        
                        groupDto = new GroupDto()
                        {
                            groupId = group.groupId,
                            groupName = group.groupName,
                            GroupImage = group.GroupImage,
                            catName = category.catName,
                            groupDesc = group.groupDesc,
                            groupLink = group.groupLink,
                            groupRules = group.groupRules,
                            country = group.country,
                            Language = group.Language,
                            tags = group.tags,

                        };
                        return groupDto;
                    }
                }    
            }
            else
            {
                groupDto.message = "Group Already Exist";
                return groupDto; 
            }
            return groupDto;  
        }

        public GroupDto UpdateGroup(int id, int catId, int appId, [FromBody] addGroupDto addGroupDto)
        {
            var group = _context.Groups.Find(id);
            if (addGroupDto == null)
            {
                return null;
            }
            if (group != null)
            {
                group.catId = catId;
                group.appId = appId;
                //group.groupName = addGroupDto.groupName;
                group.groupLink = addGroupDto.groupLink;
                group.groupDesc = addGroupDto.groupDesc;
                group.groupRules = addGroupDto.groupRules;
                group.country = addGroupDto.country;
                group.Language = addGroupDto.Language;
                group.tags = addGroupDto.tags;

                _context.Groups.Update(group);
                _context.SaveChanges();

                var category = _context.Category.Find(group.catId);
                var gropuDto = new GroupDto
                {
                    groupId = group.groupId,
                    groupName = group.groupName,
                    catName = category.catName,
                    groupDesc = group.groupDesc,
                    groupLink = group.groupLink,
                    groupRules = group.groupRules,
                    country = group.country,
                    Language = group.Language,
                    tags = group.tags
                };
                return gropuDto;
            }

            return null;
        }

        public bool UpdatePin(int id)
        {
            var group = _context.Groups.Find(id);
            if (group != null)
            {
                if (group.Pin != true)
                {
                    group.Pin = true;
                }
                else
                {
                    group.Pin = false;
                }
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool DeleteGroup(int id)
        {
            var group = _context.Groups.Find(id);
            if (group != null)
            {
                _context.Groups.Remove(group);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}
