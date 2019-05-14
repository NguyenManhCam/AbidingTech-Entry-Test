using Microsoft.EntityFrameworkCore;

namespace back_end.Models
{
    public class DiscountCode
    {

    }

    public class DiscountCodeContext : DbContext
    {
        public DiscountCodeContext(DbContextOptions<DiscountCodeContext> options)
            : base(options)
        {
        }

        public DbSet<DiscountCode> DiscountCodes { get; set; }
    }

    public enum PromotionOption
    {
        Percent,
        Money
    }

    public enum ApplyWith
    {
        AllOrder,
        ProductGroup,
        Product
    }

    public enum CustomerGroup
    {
        All,
        CustomerGroup
    }

    public enum Status
    {
        NotYetApplied,
        Applied,
        StopApplying
    }

    public enum ActionUpdate
    {
        Continue,
        Stop
    }
}