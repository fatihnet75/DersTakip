# 📝 NoteTakingApp — Fullstack Not Yönetim Uygulaması

> **NET 8** backend + **Next.js 14** frontend ile geliştirilmiş, kullanıcı kimlik doğrulaması ve not yönetimi sunan fullstack web uygulaması.

---

## 📌 Proje Amacı

NoteTakingApp, kullanıcıların hesap oluşturabildiği, giriş yapabildiği ve kişisel notlarını yönetebileceği tam işlevli bir fullstack uygulamadır. ASP.NET Core Web API backend ile Next.js 14 frontend birlikte çalışır.

Temel özellikler:

- Kullanıcı kaydı ve girişi (BCrypt ile güvenli şifreleme)
- Not oluşturma, güncelleme ve listeleme
- **Soft Delete** (Çöp kutusu) ve **Hard Delete** (Kalıcı silme) desteği
- Silinmiş notları geri yükleme
- Global Soft Delete filtresi (Entity Framework Query Filter)
- Next.js 14 App Router tabanlı modern frontend arayüzü
- Karanlık tema, animasyonlu UI (Sora + JetBrains Mono fontları)

---

## 🛠️ Kullanılan Teknolojiler & Kütüphaneler

### Backend

| Teknoloji / Kütüphane        | Versiyon    | Açıklama                                      |
|------------------------------|-------------|-----------------------------------------------|
| **.NET**                     | 8.0         | Temel çalışma ortamı                          |
| **ASP.NET Core Web API**     | 8.0         | HTTP uç noktaları ve controller yapısı        |
| **Entity Framework Core**    | 8.0         | ORM — veritabanı işlemleri                    |
| **SQL Server**               | —           | İlişkisel veritabanı                          |
| **BCrypt.Net-Next**          | —           | Şifre hashleme ve doğrulama                   |
| **Swagger / Swashbuckle**    | —           | API dokümantasyonu ve test arayüzü            |

### Frontend

| Teknoloji / Kütüphane        | Versiyon    | Açıklama                                      |
|------------------------------|-------------|-----------------------------------------------|
| **Next.js**                  | 14          | React tabanlı fullstack framework (App Router)|
| **React**                    | 18          | UI bileşen kütüphanesi                        |
| **TypeScript**               | —           | Tip güvenli JavaScript                        |
| **Axios**                    | —           | HTTP istek kütüphanesi (API iletişimi)        |
| **Google Fonts**             | —           | Sora & JetBrains Mono fontları                |

---

## ⚙️ Kurulum & Çalıştırma

### Gereksinimler

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/tr-tr/sql-server) (LocalDB veya Express yeterlidir)
- Visual Studio 2022 veya VS Code

---

### 🔧 Backend Kurulumu

#### 1. Projeyi Klonlayın

```bash
git clone https://github.com/fatihnet75/DersTaki.git
cd NoteTakingApp
```

#### 2. Veritabanı Bağlantısını Yapılandırın

`appsettings.json` dosyasını açın ve `DefaultConnection` değerini güncelleyin:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=NoteTakingDb;Trusted_Connection=True;TrustServerCertificate=True"
}
```

#### 3. Migration Uygulayın

```bash
dotnet ef database update
```

Bu komut veritabanını oluşturur ve **seed verileri** (2 örnek kullanıcı + 2 örnek not) ekler.

#### 4. Backend'i Başlatın

```bash
dotnet run
```

Backend varsayılan olarak `http://localhost:5227` adresinde çalışır.
Swagger arayüzüne erişmek için: `http://localhost:5227/swagger`

---

### 🎨 Frontend Kurulumu

#### 1. Frontend Klasörüne Geçin

```bash
cd frontend   # Next.js proje klasörünüz
```

#### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

#### 3. API Adresini Kontrol Edin

Frontend kodunda API çağrıları `http://localhost:5227` adresine yapılmaktadır. Backend farklı bir portta çalışıyorsa aşağıdaki dosyalarda ilgili URL'yi güncelleyin:

- `app/login/page.tsx`
- `app/register/page.tsx`
- `app/dashboard/page.tsx`

#### 4. Frontend'i Başlatın

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışmaya başlar.

---

### 5. Backend CORS Ayarı

`Program.cs` içinde frontend adresinizin doğru tanımlandığından emin olun:

```csharp
policy.WithOrigins("http://localhost:3000")
```

---

## 🖥️ Frontend Sayfaları

| Sayfa         | Yol         | Açıklama                                                         |
|---------------|-------------|------------------------------------------------------------------|
| **Ana Sayfa** | `/`         | Karşılama ekranı, giriş/kayıt yönlendirmesi ve özellik tanıtımı |
| **Giriş**     | `/login`    | E-posta & şifre ile oturum açma                                  |
| **Kayıt**     | `/register` | Kullanıcı adı, e-posta ve şifre ile hesap oluşturma              |
| **Dashboard** | `/dashboard`| Not ekleme, düzenleme, silme ve çöp kutusu yönetimi              |

### Sayfa Detayları

**Ana Sayfa (`/`)**
Kullanıcıyı karşılayan landing ekranı. "Sisteme Giriş Yap" ve "Ücretsiz Kayıt Ol" butonları ile yönlendirme yapar. Uygulama özelliklerini (Not Yönetimi, Çöp Kutusu, Dosya Ekleme) gösteren özellik kartları içerir.

**Giriş (`/login`)**
E-posta ve şifre alanlarından oluşan form. Başarılı girişte `UserId` ve `Username` değerleri `localStorage`'a kaydedilir ve kullanıcı `/dashboard`'a yönlendirilir.

**Kayıt (`/register`)**
Kullanıcı adı, e-posta ve şifre içeren 3 alanlı kayıt formu. Başarılı kayıt sonrası `/login` sayfasına yönlendirilir.

**Dashboard (`/dashboard`)**
Uygulamanın ana çalışma ekranı. Şu bileşenleri içerir:

- **Not Ekleme Formu:** Ders Adı, Başlık, Açıklama, İçerik ve Dosya ekleme alanları
- **Düzenleme Modu:** Bir nota tıklandığında form güncelleme moduna geçer
- **Notlarım Listesi:** Kullanıcının aktif notları ders badge'i ile listelenir
- **Çöp Kutusu:** Soft-delete edilmiş notlar görüntülenir; "Geri Yükle" veya "Kalıcı Sil" seçenekleri sunulur
- **Çıkış:** `localStorage` temizlenerek oturum sonlandırılır

---

## 🔌 API Uç Noktaları

### 🔐 Auth — `/api/auth`

| Metot  | Uç Nokta             | Açıklama                             | İstek Gövdesi                   |
|--------|----------------------|--------------------------------------|---------------------------------|
| POST   | `/api/auth/register` | Yeni kullanıcı oluşturur             | `{ username, email, password }` |
| POST   | `/api/auth/login`    | Giriş yapar, kullanıcı bilgisi döner | `{ email, password }`           |

**Kayıt — Örnek İstek:**
```json
{
  "username": "ali_kaya",
  "email": "ali@gmail.com",
  "password": "hash123"
}
```

**Giriş — Örnek Yanıt:**
```json
{
  "message": "Giriş başarılı!",
  "username": "ali_kaya",
  "userId": 3
}
```

---

### 📒 Notes — `/api/note`

| Metot  | Uç Nokta                     | Açıklama                                    |
|--------|------------------------------|---------------------------------------------|
| POST   | `/api/note`                  | Yeni not oluşturur                          |
| PUT    | `/api/note/{id}`             | Notu günceller                              |
| DELETE | `/api/note/{id}`             | Notu çöp kutusuna taşır (Soft Delete)       |
| DELETE | `/api/note/hard-delete/{id}` | Notu veritabanından kalıcı siler            |
| PUT    | `/api/note/restore/{id}`     | Çöp kutusundaki notu geri yükler            |
| GET    | `/api/note/user/{userId}`    | Kullanıcının aktif notlarını listeler       |
| GET    | `/api/note/admin/all-notes`  | Silinmiş dahil tüm notları listeler (Admin) |

**Not Oluşturma — Örnek İstek:**
```json
{
  "title": "Matematik Notları",
  "content": "Türev ve integral konuları",
  "lessonName": "Matematik",
  "description": "Sınav öncesi tekrar için",
  "filePath": "/uploads/mat_notlar.pdf",
  "userId": 1
}
```

---

## 🗄️ Veritabanı Modeli

```
Users
├── Id (PK)
├── Username
├── Email
└── PasswordHash

Notes
├── Id (PK)
├── Title
├── Content
├── LessonName
├── Description
├── FilePath (nullable)
├── CreatedAt
├── UpdatedAt (nullable)
├── DeletedAt (nullable)   <- Soft Delete alanı
└── UserId (FK -> Users)
```

> **Soft Delete Mantığı:** Bir not silindiğinde `DeletedAt` alanına tarih atılır. Entity Framework'teki global query filter sayesinde `DeletedAt != null` olan notlar sorgularda otomatik olarak gizlenir. Yönetici sorgularında `.IgnoreQueryFilters()` kullanılarak tüm notlara erişilir.

---

## 📁 Proje Klasör Yapısı

```
NoteTakingApp/
│
├── WebApplication1/                  # Backend (.NET 8)
│   ├── Controllers/
│   │   ├── AuthController.cs         # Kayıt ve giriş
│   │   └── NoteController.cs         # CRUD + Soft/Hard Delete
│   ├── Data/
│   │   └── AppDbContext.cs           # EF Core context + seed + filtreler
│   ├── Models/
│   │   ├── User.cs
│   │   ├── Notes.cs
│   │   ├── RegisterDto.cs
│   │   ├── LoginDto.cs
│   │   ├── NoteCreateDto.cs
│   │   └── NoteUpdateDto.cs
│   ├── Migrations/
│   ├── appsettings.json
│   └── Program.cs
│
└── frontend/                         # Frontend (Next.js 14)
    └── app/
        ├── page.tsx                  # Ana sayfa (Landing)
        ├── login/
        │   └── page.tsx              # Giriş ekranı
        ├── register/
        │   └── page.tsx              # Kayıt ekranı
        └── dashboard/
            └── page.tsx              # Not yönetim paneli
```

---

## 🔒 Güvenlik Notları

- Şifreler **asla açık metin** olarak saklanmaz; `BCrypt` ile hashlenir.
- Login endpoint'i, kullanıcı bulunamadığında veya şifre hatalıysa genel hata mesajı döner.
- Oturum bilgileri `localStorage`'da tutulur (`UserId`, `Username`); sayfa yenilemesinde veya çıkışta temizlenir.


---




---

*Bu proje eğitim amaçlı geliştirilmiştir. — FatihWeb © 2026*
