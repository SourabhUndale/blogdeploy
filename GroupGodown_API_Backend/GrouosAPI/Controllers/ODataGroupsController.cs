using System.Linq;
using GrouosAPI.Interface;
using GrouosAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Results;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace GrouosAPI.Controllers
{
    // Base route is "odata". Method routes below define the full endpoint.
    [Route("odata")]
    public class ODataGroupsController : ODataController
    {
        private readonly IGroupRepository _repo;

        public ODataGroupsController(IGroupRepository repo)
        {
            _repo = repo;
        }

        // Matches: GET /odata/Groups
        [EnableQuery]
        [HttpGet("Groups")]
        public IActionResult Get()
        {
            return Ok(_repo.GetAll()); // IQueryable<Groups>
        }

        // Matches: GET /odata/Groups(2)
        // Note: "Groups({key})" (no slash) matches the OData key syntax
        [EnableQuery]
        [HttpGet("Groups({key})")]
        public SingleResult<Groups> Get(int key)
        {
            var query = _repo.GetAll().Where(g => g.groupId == key);
            return SingleResult.Create(query);
        }
    }
}
