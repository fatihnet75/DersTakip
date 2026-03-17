using System;

namespace WebApplication1.Models
{
    public class Notes
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty; // Not başlığı
        public string Content { get; set; } = string.Empty; // Not içeriği

        // --- Yeni Alanlar ---
        public string LessonName { get; set; } = string.Empty; // Ders Adı
        public string Description { get; set; } = string.Empty; // Açıklama
        public string? FilePath { get; set; } // Dosya yolu (PDF, Word vb. için URL/Yol)

        public DateTime CreatedAt { get; set; } // Eklenme Tarihi
        public DateTime? UpdatedAt { get; set; } // Güncellenme Tarihi
        // --------------------

        public int UserId { get; set; }
        public User? User { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}