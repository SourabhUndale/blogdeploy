using GrouosAPI.Data;
using GrouosAPI.Interface;
using GrouosAPI.Models;
using GrouosAPI.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace GrouosAPI.Repository
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly DataContext _context;

        public CategoryRepository(DataContext context)
        {
            _context = context;
        }
        public ICollection<CategoryDto> GetAll()
        {
            var categories = _context.Category.ToList();
           
            var categoriesDto = new List<CategoryDto>();

            foreach(var category in categories)
            {
                categoriesDto.Add(new CategoryDto()
                {
                    catId = category.catId,
                    catName = category.catName
                });
            }
            return categoriesDto;    
        }

        public CategoryDto GetById(int id)
        {
            var category = _context.Category.Find(id);
            if (category == null)
            {
                return null;
            }
            var categoryDto = new CategoryDto()
            {
                catId = category.catId,
                catName = category.catName
            };

            return categoryDto;
        }

        public Category AddCategory(addCategoryDto addcategoryDto)
        {
            var category = _context.Category.Where(x => x.catName == addcategoryDto.name).FirstOrDefault();
            if(category == null)
            {
                var newCat = new Category
                {
                    catName = addcategoryDto.name
                };

                _context.Category.Add(newCat);
                _context.SaveChanges();

                return newCat;
            }
            return null;
            
        }

        public bool DeleteCategory(int id)
        {
            var category = _context.Category.Find(id);
            if (category == null)
            {
                return false;
            }
            _context.Category.Remove(category);
            _context.SaveChanges();
            return true;
        }


        public ICollection<GroupDto> GetGroupByCat(int id)
        {
            var groups = _context.Groups.Where(x => x.catId == id).ToList();
            
            var category = new Category();

            var groupDto = new List<GroupDto>();

            foreach (var group in groups)
            {
                category = _context.Category.Where(x => x.catId == group.catId).FirstOrDefault();
                groupDto.Add(new GroupDto()
                {
                    groupId = group.groupId,
                    groupName = group.groupName,
                    GroupImage = group.GroupImage,
                    Category = new CategoryDto { catId = category.catId, catName = category.catName },
                    groupDesc = group.groupDesc,
                    groupLink = group.groupLink,
                    groupRules = group.groupRules,
                    country = group.country,
                    Language = group.Language,
                    tags = group.tags
                });

            }
            return groupDto;
        }

        public CategoryDto UpdateCategory(int id, addCategoryDto addCategoryDto)
        {
            var category = _context.Category.Find(id);
            if (addCategoryDto == null && category == null)
            {
                return null;
            }
           
            category.catName = addCategoryDto.name;
            _context.Update(category);
            _context.SaveChanges();

            var categoryDto = new CategoryDto
            {
                catId = category.catId,
                catName = category.catName
            };
            return categoryDto;
        }
    }        
}
