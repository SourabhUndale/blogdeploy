using GrouosAPI.Data;
using GrouosAPI.Models;
using GrouosAPI.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace GrouosAPI.Interface
{
    public interface IGroupRepository
    {
        public GroupDto existGroup(string groupLink);
        public IQueryable<Groups> GetAll();
        public GroupDto GetById(int id);
        public ICollection<GroupDto> GetByGroupName(string groupName);
        public ICollection<GroupDto> GetGroups();
        public Groups GetGroupById(int id);
        public ICollection<GroupDto> GetGroupByAll(int catId, int appId, string country, string lang);
        public ICollection<GroupDto> GetGroupByCategory(int catId);
        public ICollection<GroupDto> GetGroupsByCategoryName(string catName);
        public ICollection<GroupDto> GetGroupsByTagName(string tagName);
        public ICollection<GroupDto> GetGroupByApp(int appId);
        public ICollection<GroupDto> GetGroupByLang(string lang);
        public ICollection<GroupDto> GetGroupByCountry(string country);
        public ICollection<GroupDto> GetGroupByLangAndCountry(string country, string lang);
        public ICollection<GroupDto> GetGroupByCategoryAndLang(int catId, string lang);
        public ICollection<GroupDto> GetGroupByAppAndCategory(int appId, int catId);
        public ICollection<GroupDto> GetGroupByAppAndLang(int appId, string lang);
        public ICollection<GroupDto> GetGroupByCategoryAndCountry(int catId, string country);
        public ICollection<GroupDto> GetGroupByAppAndCountry(int appId, string country);
        public ICollection<GroupDto> GetGroupByAppAndCountryAndLang(int appId, string country, string lang);
        public ICollection<GroupDto> GetGroupByAppAndCategoryAndLang(int appId, int catId, string lang);
        public ICollection<GroupDto> GetGroupByAppAndCategoryAndCountry(int appId, int catId, string country);
        public ICollection<GroupDto> GetGroupByCategoryAndLangAndCountry(int catId, string country, string lang);
        public Task<GroupDto> AddGroup(int catId, int appId, addGroupDto addGroupDto);
        public GroupDto UpdateGroup(int id, int catId, int appId, [FromBody] addGroupDto addGroupDto);
        public bool UpdatePin(int id);
        public bool DeleteGroup(int id);
        public bool HardDeleteGroup(int id);
    }
}
