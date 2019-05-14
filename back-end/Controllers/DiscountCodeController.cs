using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using back_end.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace back_end.Controllers {
    [Route ("api/[controller]")]
    [ApiController]
    public class DiscountCodeController : ControllerBase {
        private readonly DiscountCodeContext _context;

        public DiscountCodeController (DiscountCodeContext context) {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DiscountCode>>> Get () {
            return await _context.DiscountCodes.ToListAsync ();
        }

        [HttpGet ("{id}")]
        public async Task<ActionResult<DiscountCode>> FindOne (long id) {
            var discountCode = await _context.DiscountCodes.FindAsync (id);

            if (discountCode == null) {
                return NotFound ();
            }

            return discountCode;
        }

        [HttpPost]
        public async Task<ActionResult<DiscountCode>> Post (DiscountCode item) {
            _context.DiscountCodes.Add (item);
            await _context.SaveChangesAsync ();

            return CreatedAtAction (nameof (FindOne), new { id = 1 }, item);
        }

        [HttpPut ("{id}")]
        public async Task<IActionResult> Put (long id, DiscountCode item) {
            if (false) {
                return BadRequest ();
            }

            _context.Entry (item).State = EntityState.Modified;
            await _context.SaveChangesAsync ();

            return NoContent ();
        }

        [HttpPatch ("{id}")]
        public async Task<IActionResult> Patch (long id, ActionUpdate action) {

            switch (action) {
                case ActionUpdate.Continue:
                    break;
                case ActionUpdate.Stop:
                    break;
                default:
                    break;
            }

            return NoContent ();
        }

        [HttpDelete ("{id}")]
        public async Task<IActionResult> Delete (long id) {
            var todoItem = await _context.DiscountCodes.FindAsync (id);

            if (todoItem == null) {
                return NotFound ();
            }

            _context.DiscountCodes.Remove (todoItem);
            await _context.SaveChangesAsync ();

            return NoContent ();
        }
    }
}