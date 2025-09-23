using GrouosAPI.Controllers.Function;
using GrouosAPI.Data;
using GrouosAPI.Interface;
using GrouosAPI.Models;
using GrouosAPI.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Net;
using GrouosAPI.Services;
using Microsoft.Extensions.Configuration;

namespace GrouosAPI.Repository
{
    public class GroupRepository : IGroupRepository
    {
        private readonly DataContext _context;
        private readonly GetGroups _getGroups;
        private readonly SitemapService _sitemapService;
        private readonly SearchEnginePingService _searchEnginePingService;
        private readonly IConfiguration _configuration;
        private readonly string _baseUrl;

        public GroupRepository(DataContext context,GetGroups getGroups, SitemapService sitemapService, SearchEnginePingService searchEnginePingService, IConfiguration configuration)
        {
            _context = context;
            _getGroups = getGroups;
            _sitemapService = sitemapService;
            _searchEnginePingService = searchEnginePingService;
            _configuration = configuration;
            _baseUrl = _configuration["ApplicationSettings:BaseUrl"];
        }

        
        public GroupDto existGroup(string groupLink)
        {
            var group = _context.Groups.Where(x => x.groupLink == groupLink && x.isActive == true).FirstOrDefault();
            if (group != null)
            {
                var category = _context.Category.Where(x => x.catId == group.catId).FirstOrDefault();

                var groupDto = new GroupDto()
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
                };
                return groupDto;
            }
            return null;
        }

        public IQueryable<Groups> GetAll()
        {
            return _context.Groups.Where(g => g.isActive == true)
                .Include(a => a.Reports)
                .Include(a => a.Category)
                .Include(a => a.Application)
                .AsQueryable();
        }
        public GroupDto GetById(int id)
        {            
            try
            {
                var group = _context.Groups.Where(c => c.groupId == id && c.isActive == true)
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
                        Category = new CategoryDto { catId = category.catId, catName = category.catName },
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

        public ICollection<GroupDto> GetByGroupName(string groupName)
        {
            try
            {
                var groups = _context.Groups.Where(c => c.groupName.ToLower().Contains(groupName.ToLower()) && c.isActive == true)
                    .Include(a => a.Reports)
                    .Include(a => a.Category)
                    .Include(a => a.Application)
                    .Where(c => c.groupName.ToLower().Contains(groupName.ToLower()))
                    .ToList();

                if (groups.Any())
                {
                    var groupDtos = new List<GroupDto>();
                    foreach (var group in groups)
                    {
                        var category = _context.Category.FirstOrDefault(x => x.catId == group.catId);
                        groupDtos.Add(new GroupDto()
                        {
                            groupId = group.groupId,
                            groupName = group.groupName,
                            GroupImage = group.GroupImage,
                            Category = new CategoryDto { catId = category?.catId ?? 0, catName = category?.catName },
                            groupDesc = group.groupDesc,
                            groupLink = group.groupLink,
                            groupRules = group.groupRules,
                            country = group.country,
                            Language = group.Language,
                            tags = group.tags
                        });
                    }
                    return groupDtos;
                }
            }
            catch (Exception ex)
            {
                return new List<GroupDto>();
            }
            return new List<GroupDto>();
        }

        public ICollection<GroupDto> GetGroups()
        {
            var groups = _context.Groups.Where(g => g.isActive == true).OrderBy(g => g.groupId).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public Groups GetGroupById(int id)
        {
            return _context.Groups.Where(g => g.isActive == true).FirstOrDefault(g => g.groupId == id);
        }

        public ICollection<GroupDto> GetGroupByAll(int catId, int appId, string country, string lang)
        {
            var groups = _context.Groups.Where(x => x.catId == catId && x.appId == appId && x.Language == lang && x.country == country && x.isActive == true).ToList();
            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupByCategory(int catId)
        {
            var groups = _context.Groups.Where(x => x.catId == catId && x.isActive == true).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupsByCategoryName(string catName)
        {
            var category = _context.Category.FirstOrDefault(c => c.catName == catName);
            if (category == null)
            {
                return new List<GroupDto>();
            }

            var groups = _context.Groups.Where(x => x.catId == category.catId && x.isActive == true).ToList();
            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupsByTagName(string tagName)
        {
            var groups = _context.Groups.Where(g => g.tags.Contains(tagName) && g.isActive == true).ToList();
            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupByApp(int appId)
        {
            var groups = _context.Groups.Where(x => x.appId == appId && x.isActive == true).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupByLang(string lang)
        {
            var groups = _context.Groups.Where(x => x.Language == lang && x.isActive == true).ToList();

            var groupDto = _getGroups.ListGroupDto(groups);
            return groupDto;
        }

        public ICollection<GroupDto> GetGroupByCountry(string country)
        {
            var groups = _context.Groups.Where(x => x.country == country && x.isActive == true).ToList();

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

        public async Task<GroupDto> AddGroup(int catId, int appId, addGroupDto addGroupDto)
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
                            groupName = WebUtility.HtmlDecode(groupData.GroupName),
                            GroupImage = groupData.ImageLink,
                            groupLink = addGroupDto.groupLink,
                            groupDesc = WebUtility.HtmlDecode(addGroupDto.groupDesc),
                            groupRules = WebUtility.HtmlDecode(addGroupDto.groupRules),
                            country = addGroupDto.country,
                            Language = addGroupDto.Language,
                            tags = addGroupDto.tags
                        };

                        _context.Groups.Add(group);
                        _context.SaveChanges();

                        var sitemapUrl = $"{_baseUrl}/sitemap.xml";
                        await _searchEnginePingService.PingSearchEngines(sitemapUrl);
                        
                        groupDto = new GroupDto()
                        {
                            groupId = group.groupId,
                            groupName = WebUtility.HtmlDecode(group.groupName),
                            GroupImage = group.GroupImage,
                            Category = new CategoryDto { catId = category.catId, catName = category.catName },
                            groupDesc = WebUtility.HtmlDecode(group.groupDesc),
                            groupLink = group.groupLink,
                            groupRules = WebUtility.HtmlDecode(group.groupRules),
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
                group.groupDesc = WebUtility.HtmlDecode(addGroupDto.groupDesc);
                group.groupRules = WebUtility.HtmlDecode(addGroupDto.groupRules);
                group.country = addGroupDto.country;
                group.Language = addGroupDto.Language;
                group.tags = addGroupDto.tags;

                _context.Groups.Update(group);
                _context.SaveChanges();

                var category = _context.Category.Find(group.catId);
                var gropuDto = new GroupDto
                {
                    groupId = group.groupId,
                    groupName = WebUtility.HtmlDecode(group.groupName),
                    GroupImage = group.GroupImage,
                    Category = new CategoryDto { catId = category.catId, catName = category.catName },
                    groupDesc = WebUtility.HtmlDecode(group.groupDesc),
                    groupLink = group.groupLink,
                    groupRules = WebUtility.HtmlDecode(group.groupRules),
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
                group.isActive = false;
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool HardDeleteGroup(int id)
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
