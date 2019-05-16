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
        public List<long> ApplyWithIds { get; }
        public CustomerGroupEnum CustomerGroup { get; set; }
        public List<long> CustomerGroupIds { get; }
        public int NumberUsageLimits { get; set; }
        public bool CustomerUsageLimits { get; set; }
        public Status Status { get; set; }
        public int AmountUsed { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        private void Continue()
        {
            var timeSpan = EndTime - StartTime;
            StartTime = DateTime.Now;
            EndTime.Add(timeSpan - (EndTime - StartTime));
            Status = Status.Applied;
        }
        private void Stop()
        {
            EndTime = DateTime.Now;
            Status = Status.StopApplying;
        }
        public void Update(ActionUpdate action)
        {
            switch (action)
            {
                case ActionUpdate.Continue:
                    Continue();
                    break;
                case ActionUpdate.Stop:
                    Stop();
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

    public class DiscountCodeJunction
    {
        public long DiscountCodeId { get; set; }
        public int Id { get; set; }
    }

    public class Product : Category { }
    public class ProductGroup : Category { }
    public class CustomerGroup : Category { }

    public class DiscountCodeProduct : DiscountCodeJunction { }
    public class DiscountCodeProductGroup : DiscountCodeJunction { }
    public class DiscountCodeCustomerGroup : DiscountCodeJunction { }


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