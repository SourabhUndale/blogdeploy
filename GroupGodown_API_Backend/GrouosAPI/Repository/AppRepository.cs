using GrouosAPI.Data;
using GrouosAPI.Interface;
using GrouosAPI.Models;
using GrouosAPI.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace GrouosAPI.Repository
{
    public class AppRepository : IAppRepository
    {
        private readonly DataContext _context;

        public AppRepository(DataContext context)
        {
            _context = context;
        }
        public Application AddApp(addApplicationDto addApplicationDto)
        {
            var app = _context.Application.Where(x => x.appName == addApplicationDto.name).FirstOrDefault();

            if(app == null)
            {
                var newApp = new Application{
                    appName = addApplicationDto.name
                };

                _context.Application.Add(newApp);
                _context.SaveChanges();

                return newApp;
            }

            return null;

        }

        public bool DeleteApp(int id)
        {
            var app = _context.Application.Find(id);
            if (app == null)
            {
                return false;
            }
            _context.Application.Remove(app);
            _context.SaveChanges();
            return true;
        }

        public ICollection<ApplicationDto> GetAll()
        {
            var applications = _context.Application.ToList();

            var appDto = new List<ApplicationDto>();

            foreach (var app in applications)
            {
                appDto.Add(new ApplicationDto()
                {
                    id = app.appId,
                    name = app.appName
                });

            }

            return appDto;
        }

        public ApplicationDto GetById(int id)
        {
            var app = _context.Application.Find(id);
            if (app == null)
            {
                return null;
            }
            var appDto = new ApplicationDto()
            {
                id = app.appId,
                name = app.appName
            };

            return appDto;
        }

        public ApplicationDto UpdateApp(int id, addApplicationDto addApplicationDto)
        {
            var app = _context.Application.Find(id);
            if (addApplicationDto == null && app == null)
            {
                return null;
            }
            
            app.appName = addApplicationDto.name;
            _context.Application.Update(app);
            _context.SaveChanges();

            var appDto = new ApplicationDto
            {
                id = app.appId,
                name = app.appName
            };

            return appDto;
        }
    }
}
