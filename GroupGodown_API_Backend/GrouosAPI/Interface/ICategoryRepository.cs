using GrouosAPI.Models;
using GrouosAPI.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace GrouosAPI.Interface
{
    public interface ICategoryRepository
    {
        public ICollection<CategoryDto> GetAll();
        public CategoryDto GetById(int id);
        public ICollection<GroupDto> GetGroupByCat(int id);
        public Category AddCategory(addCategoryDto addcategoryDto);
        public CategoryDto UpdateCategory(int id, addCategoryDto addCategoryDto);
        public bool DeleteCategory(int id);
    }
}
