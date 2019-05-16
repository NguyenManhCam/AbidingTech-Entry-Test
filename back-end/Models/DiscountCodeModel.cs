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
        public CustomerGroupEnum CustomerGroup { get; set; }
        public int NumberUsageLimits { get; set; }
        public bool CustomerUsageLimits { get; set; }
        public Status Status { get; set; }
        public int AmountUsed { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public virtual ICollection<DiscountCodeProduct> DiscountCodeProducts { get; set; }
        public virtual ICollection<DiscountCodeProductGroup> DiscountCodeProductGroups { get; set; }
        public virtual ICollection<DiscountCodeCustomerGroup> DiscountCodeCustomerGroups { get; set; }

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
        public long Id { get; set; }
        public virtual DiscountCode DiscountCode { get; set; }
    }

    public class Product : Category
    {
        public virtual ICollection<DiscountCodeProduct> DiscountCodeProducts { get; set; }
    }
    public class ProductGroup : Category
    {
        public virtual ICollection<DiscountCodeProductGroup> DiscountCodeProductGroups { get; set; }
    }
    public class CustomerGroup : Category
    {
        public virtual ICollection<DiscountCodeCustomerGroup> DiscountCodeCustomerGroups { get; set; }
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