using GrouosAPI.Data;
using GrouosAPI.Models.DTO;
using GrouosAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using GrouosAPI.Interface;
using GrouosAPI.Repository;

namespace GrouosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportRepository _reportRepository;

        public ReportController(IReportRepository reportRepository)
        {
            _reportRepository = reportRepository;
        }

        //[Authorize]
        [HttpGet]
        public IActionResult GetAll()
        {

            var reportDto = _reportRepository.GetAll();
            return Ok(reportDto);
        }

        //[Authorize]
        [HttpGet]
        [Route("{id}")]
        public IActionResult GetById(int id)
        {
            var reportDto = _reportRepository.GetById(id);
            return Ok(reportDto);
        }

        //[Authorize]
        [HttpGet]
        [Route("GroupId")]
        public IActionResult GetByGroupId(int GroupId)
        {
            var reportDto = _reportRepository.GetByGroupId(GroupId);
            return Ok(reportDto);
        }

        //[Authorize]
        [HttpPost]
        public IActionResult AddReport(int groupId, [FromBody] addReportDto addReportDto)
        {
            var report = _reportRepository.AddReport(groupId, addReportDto);
            if(report != null)
            { 
                var reportDto = new ReportDto()
                {
                    ReportId = report.ReportId,
                    ReportReason = report.ReportReason,
                    ReportDesc = report.ReportDesc
                };
                return CreatedAtAction(nameof(GetById), new { id = report.ReportId }, reportDto);
            }
            else
            {
                return Content("Invalid GroupId");
            }
        }

        [Authorize]
        [HttpDelete]
        [Route("{id}")]
        public IActionResult DeleteReport(int id)
        {
            if (_reportRepository.DeleteReport(id))
            {
                return Content("Report Deleted");
            }
            return Content("Report Not Valid");
        }
    }
}
