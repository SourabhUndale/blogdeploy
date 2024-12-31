using GrouosAPI.Data;
using GrouosAPI.Interface;
using GrouosAPI.Models;
using GrouosAPI.Models.DTO;

namespace GrouosAPI.Repository
{
    public class ReportRepository : IReportRepository
    {
        private readonly DataContext _context;

        public ReportRepository(DataContext context)
        {
            _context = context;
        }
        public ICollection<ReportDto> GetAll()
        {
            var reports = _context.Report.ToList();

            var reportDto = new List<ReportDto>();

            foreach (var report in reports)
            {
                reportDto.Add(new ReportDto
                {
                    ReportId = report.ReportId,
                    ReportReason = report.ReportReason,
                    ReportDesc = report.ReportDesc
                });
            }
            return reportDto;
        }

        public ReportDto GetById(int id)
        {
            var report = _context.Report.Find(id);
            if (report == null)
            {
                return null;
            }

            var reportDto = new ReportDto()
            {
                ReportId = report.ReportId,
                ReportReason = report.ReportReason,
                ReportDesc = report.ReportDesc
            };
            return reportDto;
        }

        public ICollection<ReportDto> GetByGroupId(int GroupId)
        {
            var reports = _context.Report.Where(x => x.GroupId == GroupId).ToList();

            var reportDto = new List<ReportDto>();

            foreach (var report in reports)
            {
                reportDto.Add(new ReportDto
                {
                    ReportId = report.ReportId,
                    ReportReason = report.ReportReason,
                    ReportDesc = report.ReportDesc
                });
            }
            return reportDto;
        }

        public Report AddReport(int groupId, addReportDto addReportDto)
        {
            var existGroupId = _context.Groups.Find(groupId) != null;

            if (existGroupId)
            {
                var report = new Report
                {
                    GroupId = groupId,
                    ReportReason = addReportDto.ReportReason,
                    ReportDesc = addReportDto.ReportDesc
                };

                _context.Report.Add(report);
                _context.SaveChanges();
                return report;
            }
            return null;
        }

        public bool DeleteReport(int id)
        {
            var report = _context.Report.Find(id);
            if (report == null)
            {
                return false;
            }
            _context.Report.Remove(report);
            _context.SaveChanges();
            return true;
        }
    }
}
