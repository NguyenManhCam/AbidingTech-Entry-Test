using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace back_end.Models
{

    public class DiscountCode
    {
        public long Id { get; set; }
        public string Code { get; set; }
        public PromotionOption PromotionOption { get; set; } = PromotionOption.Percent;
        public decimal PromotionValue { get; set; }
        public decimal? MinValue { get; set; }
        public ApplyWith ApplyWith { get; set; } = ApplyWith.AllOrder;
        public CustomerGroupEnum CustomerGroup { get; set; } = CustomerGroupEnum.All;
        public int? NumberUsageLimits { get; set; }
        public bool CustomerUsageLimits { get; set; } = true;
        public Status Status { get; set; } = Status.NotYetApplied;
        public int AmountUsed { get; set; } = 0;
        public DateTime StartTime { get; set; } = DateTime.Now;
        public DateTime? EndTime { get; set; }
        private List<DiscountCodeProduct> discountCodeProducts;
        private List<DiscountCodeProductGroup> discountCodeProductGroups;
        private List<DiscountCodeCustomerGroup> discountCodeCustomerGroups;
        public List<DiscountCodeProduct> DiscountCodeProducts
        {
            get
            {
                return this.discountCodeProducts;
            }
            set
            {
                this.discountCodeProducts = ApplyWith == ApplyWith.Product ? value : new List<DiscountCodeProduct>();
            }
        }
        public List<DiscountCodeProductGroup> DiscountCodeProductGroups
        {
            get
            {
                return this.discountCodeProductGroups;
            }
            set
            {
                this.discountCodeProductGroups = ApplyWith == ApplyWith.ProductGroup ? value : new List<DiscountCodeProductGroup>();
            }
        }
        public List<DiscountCodeCustomerGroup> DiscountCodeCustomerGroups
        {
            get
            {
                return this.discountCodeCustomerGroups;
            }
            set
            {
                this.discountCodeCustomerGroups = CustomerGroup == CustomerGroupEnum.CustomerGroup ? value : new List<DiscountCodeCustomerGroup>();
            }
        }

        public DiscountCode()
        {
            this.discountCodeProducts = new List<DiscountCodeProduct>();
            this.discountCodeProductGroups = new List<DiscountCodeProductGroup>();
            this.discountCodeCustomerGroups = new List<DiscountCodeCustomerGroup>();
        }

        private void Continue()
        {
            var timeSpan = EndTime - StartTime;
            StartTime = DateTime.Now;
            if (EndTime != null)
            {
                var newEndTime = (DateTime)EndTime;
                newEndTime.Add((TimeSpan)timeSpan - (newEndTime - StartTime));
                EndTime = newEndTime;
            }
            Status = Status.Applied;
        }
        private void Stop()
        {
            EndTime = DateTime.Now;
            Status = Status.StopApplying;
        }
        public bool Update(ActionUpdate action)
        {
            switch (action)
            {
                case ActionUpdate.Continue:
                    Continue();
                    break;
                case ActionUpdate.Stop:
                    if (Status != Status.Applied)
                    {
                        return false;
                    }
                    Stop();
                    break;
                default:
                    break;
            }
            return true;
        }
    }

    public class Paging
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public Status? Status { get; set; }
        public string Code { get; set; }
    }

    public class PagingData
    {
        public int TotalItems { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public double TotalPages { get; set; }
        public List<DiscountCode> DiscountCodes { get; set; }
        public PagingData(Paging paging)
        {
            PageNumber = paging.PageNumber;
            PageSize = paging.PageSize;
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
        public long Id { get; set; }
        public DiscountCode DiscountCode { get; set; }
    }

    public class Product : Category
    {
        public List<DiscountCodeProduct> DiscountCodeProducts { get; set; }
    }
    public class ProductGroup : Category
    {
        public List<DiscountCodeProductGroup> DiscountCodeProductGroups { get; set; }
    }
    public class CustomerGroup : Category
    {
        public List<DiscountCodeCustomerGroup> DiscountCodeCustomerGroups { get; set; }
    }

    public class DiscountCodeProduct : DiscountCodeJunction
    {
        public Product Product { get; set; }
    }
    public class DiscountCodeProductGroup : DiscountCodeJunction
    {
        public ProductGroup ProductGroup { get; set; }
    }
    public class DiscountCodeCustomerGroup : DiscountCodeJunction
    {
        public CustomerGroup CustomerGroup { get; set; }
    }


    public class DiscountCodeContext : DbContext
    {
        public DiscountCodeContext(DbContextOptions<DiscountCodeContext> options) : base(options) { }

        public DbSet<DiscountCode> DiscountCodes { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductGroup> ProductGroups { get; set; }
        public DbSet<CustomerGroup> CustomerGroups { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DiscountCodeProduct>().HasKey(x => new { x.Id, x.DiscountCodeId });

            modelBuilder.Entity<DiscountCodeProduct>()
            .HasOne(dcp => dcp.DiscountCode)
            .WithMany(dc => dc.DiscountCodeProducts)
            .HasForeignKey(dcp => dcp.DiscountCodeId);

            modelBuilder.Entity<DiscountCodeProduct>()
            .HasOne(dcp => dcp.Product)
            .WithMany(p => p.DiscountCodeProducts)
            .HasForeignKey(dcp => dcp.Id);

            modelBuilder.Entity<DiscountCodeProductGroup>().HasKey(x => new { x.Id, x.DiscountCodeId });

            modelBuilder.Entity<DiscountCodeProductGroup>()
            .HasOne(dcpg => dcpg.DiscountCode)
            .WithMany(dc => dc.DiscountCodeProductGroups)
            .HasForeignKey(dcpg => dcpg.DiscountCodeId);

            modelBuilder.Entity<DiscountCodeProductGroup>()
            .HasOne(dcp => dcp.ProductGroup)
            .WithMany(pg => pg.DiscountCodeProductGroups)
            .HasForeignKey(dcp => dcp.Id);

            modelBuilder.Entity<DiscountCodeCustomerGroup>().HasKey(x => new { x.Id, x.DiscountCodeId });

            modelBuilder.Entity<DiscountCodeCustomerGroup>()
            .HasOne(dccg => dccg.DiscountCode)
            .WithMany(dc => dc.DiscountCodeCustomerGroups)
            .HasForeignKey(dccg => dccg.DiscountCodeId);

            modelBuilder.Entity<DiscountCodeCustomerGroup>()
            .HasOne(dccg => dccg.CustomerGroup)
            .WithMany(cg => cg.DiscountCodeCustomerGroups)
            .HasForeignKey(dccg => dccg.Id);
        }
    }

    public enum PromotionOption
    {
        Percent,
        Money
    }

    public enum ApplyWith
    {
        AllOrder,
        Product,
        ProductGroup

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

    public enum CategoryType
    {
        Product,
        ProductGroup,
        CustomerGroup
    }
}