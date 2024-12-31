using GrouosAPI.Data;
using GrouosAPI.Interface;
using GrouosAPI.Models;
using GrouosAPI.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace GrouosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        // [Authorize]
        [HttpGet]
        public IActionResult GetAll() 
        {
            var categoryDto = _categoryRepository.GetAll();
            return Ok(categoryDto);
        }

        // [Authorize]
        [HttpGet]
        [Route("{id}")]
        public IActionResult GetById(int id)
        {
            var categoryDto = _categoryRepository.GetById(id);
            if(categoryDto == null)
            {
                return null;
            }
            return Ok(categoryDto);
        }

        // [Authorize]
        [HttpGet]
        [Route("{id}/Group")]
        public IActionResult GetGroupByCat(int id)
        {
            var groupDto = _categoryRepository.GetGroupByCat(id);
            return Ok(groupDto);
        }

        [Authorize]
        [HttpPost]
        public IActionResult AddCategory([FromBody]addCategoryDto addCategoryDto) 
        {
            var category = _categoryRepository.AddCategory(addCategoryDto);

            if(category != null)
            {
var categoryDto = new CategoryDto
            {
                id=category.catId,
                name = category.catName
            };

            return CreatedAtAction(nameof(GetById),new { id = category.catId},categoryDto);
            }

            return Content("Categroy Type Already Exists");

            
        }

        [Authorize]
        [HttpPut]
        [Route("{id}")]
        public IActionResult UpdateCategory(int id,[FromBody] addCategoryDto addCategoryDto)
        {
            var categoryDto = _categoryRepository.UpdateCategory(id, addCategoryDto);
            return Ok(categoryDto);
        }

        [Authorize]
        [HttpDelete]
        [Route("{id}")]
        public IActionResult DeleteCategory(int id)
        {
            if (_categoryRepository.DeleteCategory(id))
            {
                return Content("Category Deleted");
            }
            return Content("Category Not Valid");
        }

    }
}
