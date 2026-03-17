public class NoteCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string LessonName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? FilePath { get; set; } // Dosya yükleme mantığını ilerde kurabiliriz, şimdilik string yol alalım.
    public int UserId { get; set; }
}