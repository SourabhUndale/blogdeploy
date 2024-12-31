using GrouosAPI.Interface;
using GrouosAPI.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GrouosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminRepository _adminRepository;

        public AdminController(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        [Authorize]
        [HttpGet]
        public IActionResult GetAll()
        {
            var admin = _adminRepository.GetAll();
            return Ok(admin);
        }

        [Authorize]
        [HttpGet]
        [Route("{id}")]
        public IActionResult GetById(Guid id)
        {
            var admin = _adminRepository.GetById(id);
            if (admin != null)
            {
                return Ok(admin);
            }
            return NotFound();
        }

        [Authorize]
        [HttpGet]
        [Route("uName")]
        public IActionResult GetByUserName(string uName,string pass)
        {
            var admin = _adminRepository.GetByUserName(uName,pass);
            if(admin != null)
            {
                return Ok(admin);
            }
            return Content("Invalid Credintials");

        }

        [HttpPost]
        public IActionResult AddUser(AddAdminDto addAdminDto)
        {
            var admin = _adminRepository.CreateUser(addAdminDto);
            if(admin != null)
            {
                return CreatedAtAction(nameof(GetById), new { id = admin.AdminId }, admin);
            }
            return Content("UserName Already Exist");
        }

        [Authorize]
        [HttpPut]
        [Route("{id}")]
        public IActionResult UpdateUser(Guid id, AddAdminDto addAdminDto)
        {
            var admin = _adminRepository.UpdateUser(id, addAdminDto);
            return Ok(admin);
        }
    }
}
