using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto request)
        {
            //  Şifreyi güvenli hale getir (Hashle)
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            //  Yeni kullanıcı nesnesini oluştur
            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = passwordHash
            };

            //  Veritabanına kaydet
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Kullanıcı başarıyla oluşturuldu!");
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            // Kullanıcıyı e-posta adresinden veritabanında bul
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            //  Kullanıcı yoksa hata dön
            if (user == null)
            {
                return BadRequest("Kullanıcı bulunamadı.");
            }

           
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return BadRequest("Hatalı şifre!");
            }

           
            return Ok(new
            {
                message = "Giriş başarılı!",
                Username = user.Username,
                UserId = user.Id
            });

        }
    }
}