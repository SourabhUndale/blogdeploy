using GrouosAPI.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GrouosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorizeController : ControllerBase
    {
        private readonly JwtAuthenticationManager _jwt;
        private readonly DataContext _context;


        public AuthorizeController(JwtAuthenticationManager jwt, DataContext context )
        {
            _jwt = jwt;
            _context = context;
        }

        [HttpPost]
        public IActionResult getToken([FromBody] User user)
        {
            var token = _jwt.Authenticate(user.username, user.password,_context);
            if (token == null)
            {
                return Unauthorized();
            }
            return Ok(token);
        }
    }

    public class User
    {
        public string username { get; set; }
        public string password { get; set; }
    }
}
