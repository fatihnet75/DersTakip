using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NoteController(AppDbContext context)
        {
            _context = context;
        }
        //NOT GÜNCELLE
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(int id, [FromBody] NoteUpdateDto request)
        {
            var note = await _context.Notes.IgnoreQueryFilters().FirstOrDefaultAsync(n => n.Id == id);

            if (note == null) return NotFound("Not bulunamadı.");

            // Sadece DTO'dan gelen alanları güncelliyoruz
            note.Title = request.Title;
            note.Content = request.Content;
            note.LessonName = request.LessonName;
            note.Description = request.Description;
            note.FilePath = request.FilePath;

            // Modelinde varsa bu alanı güncelle, yoksa satırı sil
            note.UpdatedAt = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Not başarıyla güncellendi!" });
            }
            catch (Exception ex)
            {
                // Hatanın detayını Swagger veya Console'dan görebilmek için:
                return BadRequest(ex.Message);
            }
        }
        // NOT EKLEME (Yeni alanlar eklendi)
        [HttpPost]
        public async Task<IActionResult> CreateNote(NoteCreateDto request)
        {
            var note = new Notes
            {
                Title = request.Title,
                Content = request.Content,
                LessonName = request.LessonName,
                Description = request.Description,
                FilePath = request.FilePath,
                UserId = request.UserId,
                DeletedAt = null
            };

            _context.Notes.Add(note);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Not başarıyla oluşturuldu!", noteId = note.Id });
        }

        // SOFT DELETE (Çöp Kutusuna Atar)
        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDeleteNote(int id)
        {
            // Notu bul (Eğer daha önce silinmişse bile bulabilmek için IgnoreQueryFilters ekleyebilirsin)
            var note = await _context.Notes.FirstOrDefaultAsync(n => n.Id == id);

            if (note == null) return NotFound("Not bulunamadı.");

            // İSTEDİĞİN ŞEY BURASI: Tarih atıyoruz
            note.DeletedAt = DateTime.Now;

            // Entity Framework'e bu kaydın güncellendiğini açıkça söylüyoruz
            _context.Notes.Update(note);

            await _context.SaveChangesAsync();

            return Ok("Not çöp kutusuna taşındı (DeletedAt güncellendi).");
        }

        // HARD DELETE (Veritabanından Tamamen Siler)
        [HttpDelete("hard-delete/{id}")]
        public async Task<IActionResult> HardDeleteNote(int id)
        {
            // .IgnoreQueryFilters() kullanıyoruz çünkü not zaten çöp kutusunda (soft deleted) olabilir
            var note = await _context.Notes.IgnoreQueryFilters().FirstOrDefaultAsync(n => n.Id == id);

            if (note == null) return NotFound("Not bulunamadı.");

            _context.Notes.Remove(note); // Fiziksel silme
            await _context.SaveChangesAsync();

            return Ok("Not veritabanından kalıcı olarak silindi.");
        }

        // GERİ YÜKLEME (Çöp Kutusundan Çıkarır)
        [HttpPut("restore/{id}")]
        public async Task<IActionResult> RestoreNote(int id)
        {
            var note = await _context.Notes.IgnoreQueryFilters().FirstOrDefaultAsync(n => n.Id == id);
            if (note == null) return NotFound("Not bulunamadı.");

            note.DeletedAt = null; // Tarihi temizleyerek görünür yapıyoruz
            await _context.SaveChangesAsync();

            return Ok("Not başarıyla geri yüklendi.");
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserNotes(int userId)
        {
            var notes = await _context.Notes
                .Where(n => n.UserId == userId && n.DeletedAt == null)
                .ToListAsync();

            return Ok(notes);
        }


        [HttpGet("admin/all-notes")]
        public async Task<IActionResult> GetAllNotesIncludingDeleted()
        {
            var notes = await _context.Notes
                .IgnoreQueryFilters()
                .ToListAsync();
            return Ok(notes);
        }
    }

    // DTO Sınıfları
    public class NoteCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string LessonName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public int UserId { get; set; }
    }
}