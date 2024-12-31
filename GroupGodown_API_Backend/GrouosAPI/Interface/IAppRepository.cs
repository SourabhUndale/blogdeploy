using GrouosAPI.Models.DTO;
using GrouosAPI.Models;

namespace GrouosAPI.Interface
{
    public interface IAppRepository
    {
        public ICollection<ApplicationDto> GetAll();
        public ApplicationDto GetById(int id);
        public Application AddApp(addApplicationDto addApplicationDto);
        public ApplicationDto UpdateApp(int id, addApplicationDto addApplicationDto);
        public bool DeleteApp(int id);
    }
}
