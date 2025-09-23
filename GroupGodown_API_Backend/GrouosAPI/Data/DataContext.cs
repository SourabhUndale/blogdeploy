using GrouosAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace GrouosAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) 
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Groups>()
                .HasOne(g => g.Category)
                .WithMany(c => c.groups)
                .HasForeignKey(g => g.catId);

            modelBuilder.Entity<Groups>()
                .Property(g => g.groupName)
                .IsUnicode(true);

            modelBuilder.Entity<Groups>()
                .HasOne(g => g.Application)
                .WithMany(a => a.groups)
                .HasForeignKey(g => g.appId);

            modelBuilder.Entity<Report>()
                .HasOne(r => r.Group)
                .WithMany(g => g.Reports)
                .HasForeignKey(r => r.GroupId);

            modelBuilder.Entity<Models.Blog>().ToTable("Blogs");
        }


        public DbSet<Groups> Groups { get; set; }
        public DbSet<Category> Category { get; set; } 
        public DbSet<Application> Application { get; set; }
        public DbSet<Report> Report { get; set; }
        public DbSet<Admin> Admin { get; set; }
        public DbSet<Models.Blog> Blogs { get; set; }
    }
}
