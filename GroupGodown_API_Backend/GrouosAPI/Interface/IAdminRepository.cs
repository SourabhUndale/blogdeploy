using GrouosAPI.Models;
using GrouosAPI.Models.DTO;

namespace GrouosAPI.Interface
{
    public interface IAdminRepository
    {
        public ICollection<Admin> GetAll();
        public Admin GetById(Guid id);
        public Admin GetByUserName(string uName, string pass);
        public Admin CreateUser(AddAdminDto addAdminDto);
        public Admin UpdateUser(Guid id, AddAdminDto addAdminDto);
        public Admin DeleteUser(Guid id);
    }
}
