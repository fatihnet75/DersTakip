using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Notes> Notes { get; set; }

        // KAYIT ESNASINDA OTOMATİK TARİH ATAMA
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<Notes>();
            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedAt = DateTime.Now;
                }
                else if (entry.State == EntityState.Modified)
                {
                    
                    entry.Entity.UpdatedAt = DateTime.Now;
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            modelBuilder.Entity<Notes>().HasQueryFilter(n => n.DeletedAt == null);

            // İLİŞKİ TANIMI
            modelBuilder.Entity<Notes>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notes)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // SEEDER VERİLERİ (Örnek Kullanıcılar)
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "deneme_ali", Email = "ali@gmail.com", PasswordHash = "hash123" },
                new User { Id = 2, Username = "deneme_ayse", Email = "ayse@gmail.com", PasswordHash = "hash456" }
            );

            // SEEDER VERİLERİ (Örnek Notlar)
            modelBuilder.Entity<Notes>().HasData(
                new Notes
                {
                    Id = 1,
                    Title = "C# Temelleri",
                    Content = "Class ve Object yapısı.",
                    LessonName = "Programlama",
                    UserId = 1,
                    CreatedAt = DateTime.Now
                },
                new Notes
                {
                    Id = 2,
                    Title = "React State",
                    Content = "useState kullanım detayları.",
                    LessonName = "Frontend",
                    UserId = 2,
                    CreatedAt = DateTime.Now
                }
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}