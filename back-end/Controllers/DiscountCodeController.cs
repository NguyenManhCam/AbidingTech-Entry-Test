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
                    _context.CustomerGroups.Add(new CustomerGroup { Name = $"CustomerGroup {i + 1}" });
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
            IQueryable<DiscountCode> query = _context.DiscountCodes;
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
        public async Task<DiscountCode> FindOne(long id)
        {
            var discountCode = await _context.DiscountCodes.FindAsync(id);
            return discountCode;
        }

        [HttpPost]
        public async Task<DiscountCode> Post(DiscountCode item)
        {
            _context.DiscountCodes.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        [HttpPut("{id}")]
        public async Task<DiscountCode> Put(long id, DiscountCode item)
        {
            if (id != item.Id)
            {
                return null;
            }
            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return item;
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

        [HttpGet("GetProduct")]
        public async Task<List<Category>> GetProduct()
        {
            return await _context.Products.Select(x => new Category { Id = x.Id, Name = x.Name }).ToListAsync();
        }

        [HttpGet("GetProductGroup")]
        public async Task<List<Category>> GetProductGroup()
        {
            return await _context.ProductGroups.Select(x => new Category { Id = x.Id, Name = x.Name }).ToListAsync();
        }

        [HttpGet("GetCustomerGroup")]
        public async Task<List<Category>> GetCustomerGroup()
        {
            return await _context.CustomerGroups.Select(x => new Category { Id = x.Id, Name = x.Name }).ToListAsync();
        }
    }
}