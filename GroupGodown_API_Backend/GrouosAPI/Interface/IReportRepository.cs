using GrouosAPI.Models;
using GrouosAPI.Models.DTO;

namespace GrouosAPI.Interface
{
    public interface IReportRepository
    {
        public ICollection<ReportDto> GetAll();
        public ReportDto GetById(int id);
        public ICollection<ReportDto> GetByGroupId(int GroupId);
        public Report AddReport(int groupId, addReportDto addReportDto);
        public bool DeleteReport(int id);
    }
}
