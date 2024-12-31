using Microsoft.AspNetCore.Authentication;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace GrouosAPI.Data
{
    public class JwtAuthenticationManager
    {

        private readonly string _key;
        // private readonly IDictionary<string, string> users = new Dictionary<string, string>
        // { {"test", "pass"},{"admin", "pass@123" }  };

        public JwtAuthenticationManager(string key)
        {
            _key = key;
        }

        public string Authenticate(string username, string password, DataContext context)
        {
            if(!context.Admin.Any(u => u.UserName == username && u.Password == password))
            {
                return null;
            }

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.ASCII.GetBytes(_key);

            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, username)
                }),
                Expires = DateTime.UtcNow.AddMinutes(60), 
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(tokenKey),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);


        }
    }
}
