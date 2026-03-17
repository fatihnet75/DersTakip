using System.Collections.Generic;
using WebApplication1.Models;

namespace WebApplication1.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Şifrenin açık halini değil, şifrelenmiş halini tutacak alan
        public string PasswordHash { get; set; } = string.Empty;
        public ICollection<Notes> Notes { get; set; } = new List<Notes>();
    }
}