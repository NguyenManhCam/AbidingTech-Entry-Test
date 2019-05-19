using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using back_end.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiscountCodeController : ControllerBase
    {
        private readonly DiscountCodeContext _context;

        public DiscountCodeController(DiscountCodeContext context)
        {
            _context = context;

            if (!_context.Products.Any())
            {
                for (int i = 0; i < 10; i++)
                {
                    _context.Products.Add(new Product { Name = $"Product {i + 1}" });
                    _context.ProductGroups.Add(new ProductGroup { Name = $"Product Group {i + 1}" });
                    _context.CustomerGroups.Add(new CustomerGroup { Name = $"Customer Group {i + 1}" });
                }
                for (int i = 0; i < 50; i++)
                {
                    _context.DiscountCodes.Add(new DiscountCode { Code = $"Code {i + 1}" });
                }
                _context.SaveChanges();
            };
        }

        [HttpGet]
        public async Task<PagingData> Get([FromQuery]Paging paging)
        {
            var pagingData = new PagingData(paging);
            IQueryable<DiscountCode> query = _context.DiscountCodes
            .Include(x => x.DiscountCodeProducts)
            .ThenInclude(x => x.Product)
            .Include(x => x.DiscountCodeProductGroups)
            .ThenInclude(x => x.ProductGroup)
            .Include(x => x.DiscountCodeCustomerGroups)
            .ThenInclude(x => x.CustomerGroup);
            if (paging.Code != null && paging.Code != String.Empty)
            {
                query = query.Where(x => x.Code == paging.Code);
            }
            if (paging.Status.HasValue)
            {
                query = query.Where(x => x.Status == paging.Status);
            }
            pagingData.DiscountCodes = await query.Skip((paging.PageNumber - 1) * paging.PageSize).Take(paging.PageSize).ToListAsync();
            pagingData.TotalItems = await query.CountAsync();
            pagingData.TotalPages = Math.Ceiling(pagingData.TotalItems / (float)paging.PageSize);
            return pagingData;
        }

        [HttpGet("{id}")]
        public async Task<DiscountCode> Get(long id)
        {
            var discountCode = await _context.DiscountCodes
            .Include(x => x.DiscountCodeProducts)
            .ThenInclude(x => x.Product)
            .Include(x => x.DiscountCodeProductGroups)
            .ThenInclude(x => x.ProductGroup)
            .Include(x => x.DiscountCodeCustomerGroups)
            .ThenInclude(x => x.CustomerGroup)
            .FirstOrDefaultAsync(x => x.Id == id);
            return discountCode;
        }

        [HttpPost]
        public async Task<DiscountCode> Post(DiscountCode discountCode)
        {
            foreach (var item in discountCode.DiscountCodeProducts)
            {
                var product = await _context.Products.FindAsync(item.Id);
                item.Product = product;
            }
            foreach (var item in discountCode.DiscountCodeProductGroups)
            {
                var productGroup = await _context.ProductGroups.FindAsync(item.Id);
                item.ProductGroup = productGroup;
            }
            foreach (var item in discountCode.DiscountCodeCustomerGroups)
            {
                var customerGroup = await _context.CustomerGroups.FindAsync(item.Id);
                item.CustomerGroup = customerGroup;
            }
            await _context.DiscountCodes.AddAsync(discountCode);
            await _context.SaveChangesAsync();
            return discountCode;
        }

        [HttpPut("{id}")]
        public async Task<DiscountCode> Put(long id, DiscountCode discountCode)
        {
            if (id != discountCode.Id)
            {
                return null;
            }
            foreach (var item in discountCode.DiscountCodeProducts)
            {
                var product = await _context.Products.FindAsync(item.Id);
                item.Product = product;
            }
            foreach (var item in discountCode.DiscountCodeProductGroups)
            {
                var productGroup = await _context.ProductGroups.FindAsync(item.Id);
                item.ProductGroup = productGroup;
            }
            foreach (var item in discountCode.DiscountCodeCustomerGroups)
            {
                var customerGroup = await _context.CustomerGroups.FindAsync(item.Id);
                item.CustomerGroup = customerGroup;
            }
            _context.Entry(discountCode).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return discountCode;
        }

        [HttpPatch("{id}")]
        public async Task<bool> Patch(long id, ActionUpdate action)
        {
            var discountCode = await _context.DiscountCodes.FindAsync(id);
            if (discountCode == null)
            {
                return false;
            }
            var isUpdated = discountCode.Update(action);
            if (isUpdated)
            {
                await _context.SaveChangesAsync();
            }
            return isUpdated;
        }

        [HttpDelete("{id}")]
        public async Task<bool> Delete(long id)
        {
            var discountCode = await _context.DiscountCodes.FindAsync(id);

            if (discountCode == null)
            {
                return false;
            }

            _context.DiscountCodes.Remove(discountCode);
            await _context.SaveChangesAsync();

            return true;
        }

        [HttpGet("GetCategory")]
        public async Task<List<Category>> GetCategory(CategoryType categoryType)
        {
            var listCategory = new List<Category>();
            switch (categoryType)
            {
                case CategoryType.Product:
                    listCategory = await _context.Products.Select(x => new Category { Id = x.Id, Name = x.Name }).ToListAsync();
                    break;
                case CategoryType.ProductGroup:
                    listCategory = await _context.ProductGroups.Select(x => new Category { Id = x.Id, Name = x.Name }).ToListAsync();
                    break;
                case CategoryType.CustomerGroup:
                    listCategory = await _context.CustomerGroups.Select(x => new Category { Id = x.Id, Name = x.Name }).ToListAsync();
                    break;
                default:
                    break;
            }
            return listCategory;
        }
    }
}