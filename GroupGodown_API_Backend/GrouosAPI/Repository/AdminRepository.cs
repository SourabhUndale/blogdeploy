using GrouosAPI.Data;
using GrouosAPI.Interface;
using GrouosAPI.Models;
using GrouosAPI.Models.DTO;

namespace GrouosAPI.Repository
{
    public class AdminRepository : IAdminRepository
    {
        private readonly DataContext _context;

        public AdminRepository(DataContext context)
        {
            _context = context;
        }
        public ICollection<Admin> GetAll()
        {
            var admin = _context.Admin.ToList();
            return admin;
        }

        public Admin GetById(Guid id)
        {
            var admin = _context.Admin.Find(id);            
            return admin;
            
        }
        public Admin CreateUser(AddAdminDto addAdminDto)
        {
            if(addAdminDto == null)
            {
                return null;
            }
            var admin = _context.Admin.Where(x => x.UserName == addAdminDto.UserName).FirstOrDefault();
            if (admin == null)
            {
                Admin newAdmin = new Admin
                {
                    FullName = addAdminDto.FullName,
                    MiddleName = addAdminDto.MiddleName,
                    LastName = addAdminDto.LastName,
                    UserName = addAdminDto.UserName,
                    Phno = addAdminDto.Phno,
                    Email = addAdminDto.Email,
                    Password = addAdminDto.Password
                };

                _context.Admin.Add(newAdmin);
                _context.SaveChanges();
                return newAdmin;
            }
            return null;
            
        }

        public Admin DeleteUser(Guid id)
        {
            var admin = _context.Admin.Find(id);
            _context.Remove(admin);
            _context.SaveChanges();
            return admin;
        }
    
        public Admin UpdateUser(Guid id, AddAdminDto addAdminDto)
        {
            var admin = _context.Admin.Find(id);

            if (admin != null)
            {
                admin.FullName = addAdminDto.FullName;
                admin.MiddleName = addAdminDto.MiddleName;
                admin.LastName = addAdminDto.LastName;
                admin.Phno = addAdminDto.Phno;
                admin.Email = addAdminDto.Email;
                admin.Password = addAdminDto.Password;
                // admin.UserName = addAdminDto.UserName;

                _context.Admin.Update(admin);
                _context.SaveChanges();

                return admin;
            }

            return admin;
           
        }

        public Admin GetByUserName(string uName, string pass)
        {
            var admin = _context.Admin.Where(x => x.UserName == uName).FirstOrDefault();
            
            if(admin != null && admin.Password == pass)
            {
                return admin;
            }
            return null;
        }
    }
}
