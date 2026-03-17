namespace WebApplication1.Models
{
    public class RegisterDto
    {
        // id yi artık kullanmadan çekiyoruz, çünkü kullanıcı kayıt olurken id'ye ihtiyacımız yok
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}