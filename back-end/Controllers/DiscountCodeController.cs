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
            };
        }

        [HttpGet]
        public async Task<PagingData> Get([FromQuery]Paging paging)
        {
            var pagingData = new PagingData(paging);
            pagingData.DiscountCodes = await _context.DiscountCodes.Skip((paging.PageNumber - 1) * paging.PageSize).Take(paging.PageSize).ToListAsync();
            pagingData.TotalItems = await _context.DiscountCodes.CountAsync();
            pagingData.TotalPages = Math.Ceiling(pagingData.TotalItems / (float)paging.PageSize);
            return pagingData;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DiscountCode>> FindOne(long id)
        {
            var discountCode = await _context.DiscountCodes.FindAsync(id);

            if (discountCode == null)
            {
                return NotFound();
            }

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
        public async Task<IActionResult> Put(long id, DiscountCode item)
        {
            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> Patch(long id, ActionUpdate action)
        {

            switch (action)
            {
                case ActionUpdate.Continue:
                    break;
                case ActionUpdate.Stop:
                    break;
                default:
                    break;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var todoItem = await _context.DiscountCodes.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            _context.DiscountCodes.Remove(todoItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("/api/[controller]/GetCategory")]
        public async Task<object> GetCategory()
        {
            return await _context.Products.Select(x => new { Id = x.Id, Name = x.Name }).ToListAsync();
        }
    }
}