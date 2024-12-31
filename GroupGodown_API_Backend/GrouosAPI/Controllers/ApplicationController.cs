using GrouosAPI.Data;
using GrouosAPI.Models.DTO;
using GrouosAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using GrouosAPI.Interface;
using GrouosAPI.Repository;

namespace GrouosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IAppRepository _appRepository;

        public ApplicationController(DataContext context, IAppRepository appRepository)
        {
            _context = context;
            _appRepository = appRepository;
        }

        // [Authorize]
        [HttpGet]
        public IActionResult GetAll()
        {
            var appDto = _appRepository.GetAll();
            return Ok(appDto);
            
        }

        // [Authorize]
        [HttpGet]
        [Route("{id}")]
        public IActionResult GetById(int id)
        {
            var appDto = _appRepository.GetById(id);
            if(appDto != null)
            {
                return Ok(appDto);
            }
            return null;
        }

        [Authorize]
        [HttpPost]
        public IActionResult AddApplication([FromBody] addApplicationDto addApplicationDto)
        {
            var app = _appRepository.AddApp(addApplicationDto);

            if(app != null)
            {
                            var appDto = new ApplicationDto
            {
                id = app.appId,
                name = app.appName
            };
            return CreatedAtAction(nameof(GetById),new { id = app.appId },appDto);
            }

            return Content("Applcation Type Already Exists");


        }

        [Authorize]
        [HttpPut]
        [Route("{id}")]
        public IActionResult UpdateApplication(int id, [FromBody] addApplicationDto addApplicationDto)
        {
            var appDto = _appRepository.UpdateApp(id, addApplicationDto);
            if(appDto == null)
            {
                return Content("AppName Does Not Exist");
            }
            return Ok(appDto);
        }

        [Authorize]
        [HttpDelete]
        [Route("{id}")]
        public IActionResult DeleteApp(int id)
        {
            if (_appRepository.DeleteApp(id))
            {
                return Content("App Deleted");
            }
            return Content("App Not Valid");
        }

    }
}

