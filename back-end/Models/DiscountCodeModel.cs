using Microsoft.EntityFrameworkCore;

namespace back_end.Models {

    public class DiscountCode {
        public long Id { get; set; }
        public string Code { get; set; }
        public PromotionOption PromotionOption { get; set; }
        public decimal PromotionValue { get; set; }
        public decimal MinValue { get; set; }
        public ApplyWith ApplyWith { get; set; }
        public CustomerGroup CustomerGroup { get; set; }
        public int NumberUsageLimits { get; set; }
        public bool CustomerUsageLimits { get; set; }
        public Status Status { get; set; }
        public int AmountUsed { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public ICollection<Post> Posts { get; set; }

    }

    public class Category {
        public long Id { get; set; }
        public string Name { get; set; }
    }

    public class Product : Category { }
    public class ProductGroup : Category { }
    public class CustomerGroup : Category { }

    public class DiscountCodeContext : DbContext {
        public DiscountCodeContext (DbContextOptions<DiscountCodeContext> options) : base (options) { }

        public DbSet<DiscountCode> DiscountCodes { get; set; }
    }

    public enum PromotionOption {
        Percent,
        Money
    }

    public enum ApplyWith {
        AllOrder,
        ProductGroup,
        Product
    }

    public enum CustomerGroup {
        All,
        CustomerGroup
    }

    public enum Status {
        NotYetApplied,
        Applied,
        StopApplying
    }

    public enum ActionUpdate {
        Continue,
        Stop
    }
}