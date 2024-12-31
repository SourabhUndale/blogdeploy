using GrouosAPI.Controllers.Function;
using GrouosAPI.Data;
using GrouosAPI.Interface;
using GrouosAPI.Models;
using GrouosAPI.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Results;
using System.Diagnostics.Metrics;
using System.Net;
using System.Text.RegularExpressions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static System.Net.Mime.MediaTypeNames;

namespace GrouosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        //private readonly DataContext _context;
        private readonly IGroupRepository _groupRepository;

        public GroupsController(/*DataContext context,*/IGroupRepository groupRepository)
        {
            //_context = context;
            _groupRepository = groupRepository;
        }


        [EnableQuery]
        [HttpGet]
        public IQueryable<Groups> Get()
        {
            return _groupRepository.GetAll();
        }

        // public IActionResult Get(ODataQueryOptions<Group> options)
        // {
        //     var groups = _groupRepository.GetAll();

        //     // Apply OData query options
        //     var queryResults = (IQueryable<Group>)options.ApplyTo(groups);

        //     return Ok(queryResults);    
        // }


        //[EnableQuery]
        //[HttpGet]
        //[Route("{id}")]
        //public IActionResult GetById( int id)
        //{
        //    return Ok(_groupRepository.GetById(id));
        //}

        [EnableQuery]
        // [Authorize]
        [HttpGet]
        [Route("{id}")]
        public IActionResult GetById(int id)
        {
            var groupDto = _groupRepository.GetById(id);
            if(groupDto != null)
            {
                return Ok(groupDto);
            }
            return null;
            
        }

        //[Authorize]
        [HttpGet]
        [Route("id/Groups")]
        public IActionResult GetByCatOrCountryOrLang(int? catId, string? country, string? lang, int? appId)
        {
            if (catId == null && country == null && lang == null && appId == null)
            {
                Console.WriteLine("Combination 1: All variables are null");
                var groupDto = _groupRepository.GetGroups();

                //var groups = _groupRepository.GetGroups();
                //var groupDto = new List<GroupDto> { };
                //var category = new Category();


                //foreach (var group in groups)
                //{
                //    category = _context.Category.Where(x => x.catId == group.catId).FirstOrDefault();
                //    groupDto.Add(new GroupDto()
                //    {
                //        groupId = group.groupId,
                //        groupName = group.groupName,
                //        GroupImage = group.GroupImage,
                //        catName = category.catName,
                //        groupDesc = group.groupDesc,
                //        groupLink = group.groupLink,
                //        groupRules = group.groupRules,
                //        country = group.country,
                //        Language = group.Language,
                //        tags = group.tags
                //    }); 

                //}
                return Ok(groupDto);
            }
            else if (catId == null && country == null && lang == null && appId != null)
            {
                Console.WriteLine("Combination 2: catId, country, and lang are null, appId is not null");

                var groupDto = _groupRepository.GetGroupByApp((int)appId);
                return Ok(groupDto);
            }
            else if (catId == null && country == null && lang != null && appId == null)
            {
                Console.WriteLine("Combination 3: catId, country, and appId are null, lang is not null");

                var groupDto = _groupRepository.GetGroupByLang(lang);
                return Ok(groupDto);
            }
            else if (catId == null && country == null && lang != null && appId != null)
            {
                Console.WriteLine("Combination 4: catId and country are null, lang and appId are not null");

                var groupDto = _groupRepository.GetGroupByAppAndLang((int)appId, lang);
                return Ok(groupDto);
            }
            else if (catId == null && country != null && lang == null && appId == null)
            {
                Console.WriteLine("Combination 5: catId, lang, and appId are null, country is not null");

                var groupDto = _groupRepository.GetGroupByCountry(country);
                return Ok(groupDto);
            }
            else if (catId == null && country != null && lang == null && appId != null)
            {
                Console.WriteLine("Combination 6: catId and lang are null, country and appId are not null");

                var groupDto = _groupRepository.GetGroupByAppAndCountry((int)appId, country);
                return Ok(groupDto);
            }
            else if (catId == null && country != null && lang != null && appId == null)
            {
                Console.WriteLine("Combination 7: catId and appId are null, country and lang are not null");

                var groupDto = _groupRepository.GetGroupByLangAndCountry(country, lang);
                return Ok(groupDto);
            }
            else if (catId == null && country != null && lang != null && appId != null)
            {
                Console.WriteLine("Combination 8: catId is null, country, lang, and appId are not null");

                var groupDto = _groupRepository.GetGroupByAppAndCountryAndLang((int)appId, country, lang);
                return Ok(groupDto);
            }
            else if (catId != null && country == null && lang == null && appId == null)
            {
                Console.WriteLine("Combination 9: country, lang, and appId are null, catId is not null");

                var groupDto = _groupRepository.GetGroupByCategory((int)catId);
                return Ok(groupDto);
            }
            else if (catId != null && country == null && lang == null && appId != null)
            {
                Console.WriteLine("Combination 10: country, lang are null, catId and appId are not null");

                var groupDto = _groupRepository.GetGroupByAppAndCategory((int)appId, (int)catId);
                return Ok(groupDto);
            }
            else if (catId != null && country == null && lang != null && appId == null)
            {
                Console.WriteLine("Combination 11: country, appId are null, catId and lang are not null");

                var groupDto = _groupRepository.GetGroupByCategoryAndLang((int)catId, lang);
                return Ok(groupDto);
            }
            else if (catId != null && country == null && lang != null && appId != null)
            {
                Console.WriteLine("Combination 12: country  null, catId and lang and appId are not null");

                var groupDto = _groupRepository.GetGroupByAppAndCategoryAndLang((int)appId, (int)catId, lang);
                return Ok(groupDto);
            }
            else if (catId != null && country != null && lang == null && appId == null)
            {
                Console.WriteLine("Combination 13: lang, appId are null, catId and country are not null");

                var groupDto = _groupRepository.GetGroupByCategoryAndCountry((int)catId, country);
                return Ok(groupDto);
            }
            else if (catId != null && country != null && lang == null && appId != null)
            {
                Console.WriteLine("Combination 14: lang is null, catId,country and appId are not null");

                var groupDto = _groupRepository.GetGroupByAppAndCategoryAndCountry((int)appId, (int)catId, country);
                return Ok(groupDto);
            }
            else if (catId != null && country != null && lang != null && appId == null)
            {
                Console.WriteLine("Combination 15: lang and appId are null, lang and catId and country are not null");

                var groupDto = _groupRepository.GetGroupByCategoryAndLangAndCountry((int)catId, country, lang);
                return Ok(groupDto);
            }
            else if (catId != null && country != null && lang != null && appId != null)
            {
                Console.WriteLine("Combination 16: No variables are null");

                var groupDto = _groupRepository.GetGroupByAll((int)catId, (int)appId, country, lang);
                return Ok(groupDto);
            }
            return Ok(null);

        }


        //[Authorize]
        [HttpPost]
        public IActionResult addGroup(int catId, int appId, [FromBody] addGroupDto addGroupDto)
        {
            var groupDto = _groupRepository.AddGroup(catId, appId, addGroupDto);
            if(groupDto != null)
            {
                return Ok(groupDto);
            }
            return Content("Group not valid");

            //if(!_groupRepository.existGroup(addGroupDto.groupLink))
            //{ 
            //    GroupData groupData = GroupImage.GetImageAndName(addGroupDto.groupLink);

            //    if (groupData != null)
            //    {
            //        var category = _context.Category.Find(catId);
            //        var existAppId = _context.Application.Find(appId) != null;
            //        if (category != null && existAppId && groupData.ImageLink != null && groupData.GroupName != null)
            //        {
            //            var group = new Groups
            //            {
            //                catId = catId,
            //                appId = appId,
            //                groupName = groupData.GroupName,
            //                GroupImage = groupData.ImageLink,
            //                groupLink = addGroupDto.groupLink,
            //                groupDesc = addGroupDto.groupDesc,
            //                groupRules = addGroupDto.groupRules,
            //                country = addGroupDto.country,
            //                Language = addGroupDto.Language,
            //                tags = addGroupDto.tags
            //            };

            //            //_context.Groups.Add(group);
            //            //_context.SaveChanges();

            //            var groupDto = new GroupDto()
            //            {
            //                groupId = group.groupId,
            //                groupName = group.groupName,
            //                GroupImage = group.GroupImage,
            //                catName = category.catName,
            //                groupDesc = group.groupDesc,
            //                groupLink = group.groupLink,
            //                groupRules = group.groupRules,
            //                country = group.country,
            //                Language = group.Language,
            //                tags = group.tags
            //            };
            //            return CreatedAtAction(nameof(Get), new { id = group.groupId }, groupDto);
            //        }
            //        else
            //        {
            //            return Content("Category Or App Not Valid");
            //        }
            //    }
            //    else
            //    {
            //        return Content("Group Not Valid");
            //    }
            //}
            //else
            //{
            //    return Content("Group already exists");
            //}

        }

        [Authorize]
        [HttpPut]
        [Route("{id}")]
        public IActionResult UpdateGroup(int id,int catId,int appId, [FromBody] addGroupDto addGroupDto)
        {
            var groupDto = _groupRepository.UpdateGroup(id, catId, appId, addGroupDto);
            if (groupDto != null)
            {
                return Ok(groupDto);
            }

            return null;
            //  var group = _context.Groups.Find(id);
            //  if (addGroupDto == null)
            //  {
            //      return NotFound();
            //  }
            //  if (group == null)
            //  {
            //      return NotFound();
            //  }

            //  group.catId = catId;  
            //  group.appId = appId;
            ////group.groupName = addGroupDto.groupName;
            //  group.groupLink = addGroupDto.groupLink;
            //  group.groupDesc = addGroupDto.groupDesc;
            //  group.groupRules = addGroupDto.groupRules;
            //  group.country = addGroupDto.country;
            //  group.Language = addGroupDto.Language;
            //  group.tags = addGroupDto.tags; 

            // _context.Groups.Update(group);
            // _context.SaveChanges();

            //  var category = _context.Category.Find(group.catId);
            //  var gropuDto = new GroupDto
            //  {
            //      groupId = group.groupId,
            //      groupName = group.groupName,
            //      catName = category.catName,
            //      groupDesc = group.groupDesc,
            //      groupLink = group.groupLink,
            //      groupRules = group.groupRules,
            //      country = group.country,
            //      Language = group.Language,
            //      tags = group.tags
            //  };



            //  return Ok(gropuDto);
        }

        [Authorize]
        [HttpPut]
        [Route("Pin")]
        public IActionResult UpdatePin(int id)
        {
            var pinUpdated = _groupRepository.UpdatePin(id);
            if(pinUpdated)
            {
                return Ok("Pin Changed");
            }
            return Content("Group not exist");
            //var group = _context.Groups.Find(id);
            //if (group != null)
            //{
            //    if (group.Pin != true)
            //    {
            //        group.Pin = true;
            //    }
            //    else
            //    {
            //        group.Pin = false;
            //    }
            //    _context.SaveChanges();
            //    return Ok();
            //}
            //return Content("Group Not Found");
        }

        [Authorize]
        [HttpDelete]
        [Route("{id}")]
        public IActionResult DeleteGroup(int id)
        {
            var deleted = _groupRepository.DeleteGroup(id);
            if(deleted)
            {
                return Ok();
            }
            return Content("Group not exist");

            //var group = _context.Groups.Find(id);
            //if (group == null)
            //{
            //    return NotFound();
            //}
            //_context.Groups.Remove(group);
            //_context.SaveChanges();
            //return Ok();
        }


    }
}
