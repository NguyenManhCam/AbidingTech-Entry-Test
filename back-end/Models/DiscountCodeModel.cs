using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace back_end.Models
{

    public class DiscountCode
    {
        public long Id { get; set; }
        public string Code { get; set; }
        public PromotionOption PromotionOption { get; set; }
        public decimal PromotionValue { get; set; }
        public decimal MinValue { get; set; }
        public ApplyWith ApplyWith { get; set; }
        public ICollection<long> ApplyWithIds { get; set; }
        public CustomerGroupEnum CustomerGroup { get; set; }
        public ICollection<long> CustomerGroupIds { get; set; }
        public int NumberUsageLimits { get; set; }
        public bool CustomerUsageLimits { get; set; }
        public Status Status { get; set; }
        public int AmountUsed { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        private void Continue()
        {
            Status = Status.Applied;
            var timeSpan = EndTime - StartTime;
            StartTime = DateTime.Now;
            EndTime.Add(timeSpan - (EndTime - StartTime));
        }
        public void Update(ActionUpdate action)
        {
            switch (action)
            {
                case ActionUpdate.Continue:
                    Continue();
                    break;
                case ActionUpdate.Stop:
                    break;
                default:
                    break;
            }
        }
    }

    public class Category
    {
        public long Id { get; set; }
        public string Name { get; set; }
    }

    public class Product : Category { }
    public class ProductGroup : Category { }
    // public class CustomerGroup : Category { }

    public class DiscountCodeContext : DbContext
    {
        public DiscountCodeContext(DbContextOptions<DiscountCodeContext> options) : base(options) { }

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

    public enum CustomerGroupEnum
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