"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Note {
    id: number;
    title: string;
    content: string;
    lessonName: string;
    description: string;
    userId: number;
    filePath?: string | null;
    deletedAt?: string | null;
}

export default function DashboardPage() {
    const router = useRouter();

    const [notes, setNotes] = useState<Note[]>([]);
    const [trash, setTrash] = useState<Note[]>([]);
    const [showTrash, setShowTrash] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [lessonName, setLessonName] = useState("");
    const [description, setDescription] = useState("");
    const [filePath, setFilePath] = useState("");

    const loadAllData = useCallback(async () => {
        const storedId = localStorage.getItem("UserId");
        if (!storedId || storedId === "undefined") {
            setLoading(false);
            return;
        }
        const currentUserId = parseInt(storedId, 10);

        try {
            const activeRes = await axios.get(`http://localhost:5227/api/Note/user/${currentUserId}`);
            setNotes(activeRes.data);

            const allRes = await axios.get(`http://localhost:5227/api/Note/admin/all-notes`);
            const deletedOnes = allRes.data.filter(
                (n: Note) => n.userId === currentUserId && n.deletedAt !== null
            );
            setTrash(deletedOnes);
        } catch (err) {
            console.error("Veri yükleme hatası:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            const storedId = localStorage.getItem("UserId");
            if (!storedId || storedId === "undefined" || storedId === "null") {
                router.replace("/login");
            } else {
                loadAllData();
            }
        }
    }, [isClient, loadAllData, router]);

    useEffect(() => { setIsClient(true); }, []);

    useEffect(() => {
        if (isClient) {
            const storedId = localStorage.getItem("UserId");
            if (!storedId || storedId === "undefined") {
                router.push("/login");
            } else {
                loadAllData();
            }
        }
    }, [isClient, loadAllData, router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setFilePath(file.name);
    };

    const clearForm = () => {
        setEditingNoteId(null);
        setTitle(""); setContent(""); setLessonName(""); setDescription(""); setFilePath("");
    };

    const handleEditInitiate = (note: Note) => {
        setEditingNoteId(note.id);
        setTitle(note.title);
        setContent(note.content);
        setLessonName(note.lessonName);
        setDescription(note.description);
        setFilePath(note.filePath || "");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSaveProcess = async () => {
        const storedId = localStorage.getItem("UserId");
        if (!storedId) return;

        if (!title.trim() || !content.trim() || !lessonName.trim()) {
            alert("Lütfen gerekli alanları doldurun.");
            return;
        }

        const noteDto = {
            title: title.trim(),
            content: content.trim(),
            lessonName: lessonName.trim(),
            description: description.trim() || "Açıklama yok",
            filePath: filePath || ""
        };

        const handleLogout = () => {
            localStorage.clear();
            router.replace("/login");
        };

        try {
            if (editingNoteId) {
                await axios.put(`http://localhost:5227/api/Note/${editingNoteId}`, noteDto);
                alert("Not başarıyla güncellendi!");
            } else {
                const createDto = { ...noteDto, userId: parseInt(storedId, 10) };
                await axios.post("http://localhost:5227/api/Note", createDto);
                alert("Not başarıyla kaydedildi!");
            }
            clearForm();
            loadAllData();
        } catch (err) {
            alert("İşlem sırasında bir hata oluştu: ");
        }
    };

    const handleAction = async (id: number, type: 'soft' | 'restore' | 'hard') => {
        try {
            if (type === 'soft') {
                await axios.delete(`http://localhost:5227/api/Note/${id}`);
            } else if (type === 'restore') {
                await axios.put(`http://localhost:5227/api/Note/restore/${id}`);
            } else if (type === 'hard') {
                const confirmDelete = confirm("⚠️ DİKKAT: Bu not kalıcı olarak silinecektir. Emin misiniz?");
                if (!confirmDelete) return;
                await axios.delete(`http://localhost:5227/api/Note/hard-delete/${id}`);
            }
            loadAllData();
        } catch (err) {
            console.error("İşlem hatası:", err);
            alert("İşlem başarısız.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.replace("/login");
    };

    if (!isClient) return null;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .dash-root {
                    min-height: 100vh;
                    background: #0a0a0f;
                    font-family: 'Sora', sans-serif;
                    color: #f1f5f9;
                    position: relative;
                    overflow-x: hidden;
                }

                .dash-root::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background:
                        radial-gradient(ellipse 80% 60% at 10% 10%, rgba(59,130,246,0.10) 0%, transparent 60%),
                        radial-gradient(ellipse 60% 80% at 90% 90%, rgba(139,92,246,0.08) 0%, transparent 60%);
                    pointer-events: none;
                    z-index: 0;
                }

                .dash-root::after {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
                    background-size: 48px 48px;
                    pointer-events: none;
                    z-index: 0;
                }

                .dash-inner {
                    position: relative;
                    z-index: 1;
                    max-width: 860px;
                    margin: 0 auto;
                    padding: 32px 20px 80px;
                }

                /* HEADER */
                .dash-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(16,16,24,0.85);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 18px;
                    padding: 20px 28px;
                    margin-bottom: 28px;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 0 0 1px rgba(59,130,246,0.07), 0 8px 32px rgba(0,0,0,0.4);
                    animation: fadeUp 0.5s 0.05s both;
                }

                .header-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .brand-icon {
                    width: 34px;
                    height: 34px;
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    border-radius: 9px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 13px;
                    font-weight: 500;
                    color: #fff;
                }

                .brand-texts {}

                .brand-title {
                    font-size: 16px;
                    font-weight: 700;
                    letter-spacing: -0.4px;
                    color: #f1f5f9;
                }

                .brand-title span {
                    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .brand-user {
                    font-size: 10.5px;
                    color: #475569;
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: 0.6px;
                    margin-top: 2px;
                }

                .header-actions {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                .btn-trash {
                    padding: 9px 18px;
                    border-radius: 10px;
                    font-size: 11.5px;
                    font-weight: 600;
                    font-family: 'Sora', sans-serif;
                    cursor: pointer;
                    border: 1px solid rgba(255,255,255,0.08);
                    transition: all 0.2s;
                    letter-spacing: 0.1px;
                }

                .btn-trash.active {
                    background: linear-gradient(135deg, #3b82f6, #6366f1);
                    color: #fff;
                    border-color: transparent;
                    box-shadow: 0 4px 14px rgba(59,130,246,0.3);
                }

                .btn-trash.inactive {
                    background: rgba(255,255,255,0.05);
                    color: #94a3b8;
                }

                .btn-trash.inactive:hover {
                    background: rgba(255,255,255,0.09);
                    color: #cbd5e1;
                }

                .btn-logout {
                    padding: 9px 16px;
                    border-radius: 10px;
                    font-size: 11.5px;
                    font-weight: 600;
                    font-family: 'Sora', sans-serif;
                    cursor: pointer;
                    border: 1px solid rgba(239,68,68,0.2);
                    background: rgba(239,68,68,0.07);
                    color: #f87171;
                    transition: all 0.2s;
                }

                .btn-logout:hover {
                    background: rgba(239,68,68,0.15);
                    border-color: rgba(239,68,68,0.35);
                }

                /* FORM CARD */
                .form-card {
                    background: rgba(16,16,24,0.85);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 18px;
                    padding: 32px;
                    margin-bottom: 28px;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 0 0 1px rgba(59,130,246,0.07), 0 8px 32px rgba(0,0,0,0.4);
                    animation: fadeUp 0.5s 0.1s both;
                }

                .form-heading {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                }

                .form-heading-bar {
                    width: 3px;
                    height: 22px;
                    border-radius: 4px;
                }

                .form-heading-bar.edit { background: #f59e0b; }
                .form-heading-bar.new  { background: linear-gradient(180deg, #3b82f6, #8b5cf6); }

                .form-heading-text {
                    font-size: 16px;
                    font-weight: 700;
                    color: #f1f5f9;
                    letter-spacing: -0.3px;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }

                @media (max-width: 600px) {
                    .form-grid { grid-template-columns: 1fr; }
                    .col-span-2 { grid-column: span 1 !important; }
                }

                .col-span-2 { grid-column: span 2; }

                .field-label {
                    display: block;
                    font-size: 10.5px;
                    font-weight: 500;
                    color: #64748b;
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: 0.7px;
                    text-transform: uppercase;
                    margin-bottom: 6px;
                }

                .field-input,
                .field-textarea {
                    width: 100%;
                    padding: 12px 14px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 11px;
                    color: #f1f5f9;
                    font-size: 13.5px;
                    font-family: 'Sora', sans-serif;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                    resize: none;
                }

                .field-input::placeholder,
                .field-textarea::placeholder {
                    color: #2d3f55;
                }

                .field-input:focus,
                .field-textarea:focus {
                    border-color: rgba(59,130,246,0.45);
                    background: rgba(59,130,246,0.05);
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.10);
                }

                .file-zone {
                    padding: 14px 16px;
                    background: rgba(59,130,246,0.04);
                    border: 1.5px dashed rgba(59,130,246,0.18);
                    border-radius: 11px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .file-zone input[type="file"] {
                    font-size: 11.5px;
                    color: #64748b;
                    font-family: 'JetBrains Mono', monospace;
                    cursor: pointer;
                }

                .file-name {
                    font-size: 10px;
                    color: #60a5fa;
                    font-family: 'JetBrains Mono', monospace;
                    font-weight: 500;
                }

                .form-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }

                .btn-save {
                    flex: 1;
                    padding: 13px;
                    border: none;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 700;
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
                }

                .btn-save.new-mode {
                    background: linear-gradient(135deg, #3b82f6, #6366f1);
                    color: #fff;
                    box-shadow: 0 4px 18px rgba(59,130,246,0.35);
                }

                .btn-save.edit-mode {
                    background: linear-gradient(135deg, #f59e0b, #ef4444);
                    color: #fff;
                    box-shadow: 0 4px 18px rgba(245,158,11,0.3);
                }

                .btn-save:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }

                .btn-cancel {
                    padding: 13px 22px;
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    background: rgba(255,255,255,0.04);
                    color: #64748b;
                    font-size: 11.5px;
                    font-weight: 600;
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: 0.8px;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-cancel:hover {
                    background: rgba(255,255,255,0.08);
                    color: #94a3b8;
                }

                /* NOTES LIST */
                .list-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                    animation: fadeUp 0.5s 0.15s both;
                    padding: 0 4px;
                }

                .list-title {
                    font-size: 15px;
                    font-weight: 700;
                    color: #f1f5f9;
                    letter-spacing: -0.3px;
                }

                .list-count {
                    font-size: 10.5px;
                    color: #475569;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.07);
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-family: 'JetBrains Mono', monospace;
                }

                .notes-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .note-card {
                    background: rgba(16,16,24,0.85);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 16px;
                    padding: 20px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    backdrop-filter: blur(16px);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    transition: border-color 0.2s, transform 0.2s;
                    animation: fadeUp 0.4s both;
                }

                .note-card:hover {
                    border-color: rgba(59,130,246,0.2);
                    transform: translateY(-1px);
                }

                .note-meta {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }

                .note-lesson-badge {
                    font-size: 9.5px;
                    font-family: 'JetBrains Mono', monospace;
                    font-weight: 500;
                    background: rgba(59,130,246,0.12);
                    color: #60a5fa;
                    border: 1px solid rgba(59,130,246,0.18);
                    padding: 3px 10px;
                    border-radius: 6px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .note-title {
                    font-size: 15px;
                    font-weight: 600;
                    color: #f1f5f9;
                    letter-spacing: -0.3px;
                    margin-bottom: 4px;
                }

                .note-preview {
                    font-size: 12.5px;
                    color: #475569;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }

                .note-actions {
                    display: flex;
                    gap: 8px;
                    flex-shrink: 0;
                }

                @media (max-width: 600px) {
                    .note-card { flex-direction: column; align-items: flex-start; }
                    .note-actions { width: 100%; }
                }

                .btn-note {
                    padding: 9px 16px;
                    border-radius: 9px;
                    font-size: 10.5px;
                    font-weight: 600;
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: 0.4px;
                    cursor: pointer;
                    border: 1px solid transparent;
                    text-transform: uppercase;
                    transition: all 0.18s;
                }

                .btn-edit {
                    background: rgba(245,158,11,0.1);
                    color: #fbbf24;
                    border-color: rgba(245,158,11,0.18);
                }
                .btn-edit:hover {
                    background: #f59e0b;
                    color: #fff;
                    border-color: transparent;
                }

                .btn-delete {
                    background: rgba(239,68,68,0.08);
                    color: #f87171;
                    border-color: rgba(239,68,68,0.15);
                }
                .btn-delete:hover {
                    background: #ef4444;
                    color: #fff;
                    border-color: transparent;
                }

                .btn-restore {
                    background: rgba(16,185,129,0.08);
                    color: #34d399;
                    border-color: rgba(16,185,129,0.15);
                }
                .btn-restore:hover {
                    background: #10b981;
                    color: #fff;
                    border-color: transparent;
                }

                .btn-hard-delete {
                    background: rgba(239,68,68,0.12);
                    color: #f87171;
                    border-color: rgba(239,68,68,0.2);
                }
                .btn-hard-delete:hover {
                    background: #dc2626;
                    color: #fff;
                    border-color: transparent;
                }

                /* LOADING */
                .loading-state {
                    text-align: center;
                    padding: 80px 0;
                    color: #1e293b;
                    font-size: 13px;
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    animation: pulse 1.5s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 1; }
                }

                /* EMPTY */
                .empty-state {
                    text-align: center;
                    padding: 60px 0;
                    color: #1e293b;
                    font-size: 13px;
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: 1px;
                }

                /* FOOTER */
                .dash-footer {
                    text-align: center;
                    padding: 20px 0 0;
                    font-size: 9.5px;
                    color: #1e293b;
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="dash-root">
                <div className="dash-inner">

                    {/* HEADER */}
                    <header className="dash-header">
                        <div className="header-brand">
                            <div className="brand-icon">T</div>
                            <div className="brand-texts">
                                <div className="brand-title"><span>Not</span>Larım</div>
                                <div className="brand-user">@{localStorage.getItem("Username") || "kullanıcı"}</div>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button
                                className={`btn-trash ${showTrash ? 'active' : 'inactive'}`}
                                onClick={() => { setShowTrash(!showTrash); clearForm(); }}
                            >
                                {showTrash ? "📂 Notlarıma Dön" : "🗑️ Çöp Kutusu"}
                            </button>
                            <button className="btn-logout" onClick={handleLogout}>Çıkış</button>
                        </div>
                    </header>

                    {loading ? (
                        <div className="loading-state">Yükleniyor...</div>
                    ) : (
                        <>
                            {/* FORM */}
                            {!showTrash && (
                                <section className="form-card">
                                    <div className="form-heading">
                                        <div className={`form-heading-bar ${editingNoteId ? 'edit' : 'new'}`} />
                                        <span className="form-heading-text">
                                            {editingNoteId ? "Notu Düzenle" : "Yeni Ders Notu Ekle"}
                                        </span>
                                    </div>

                                    <div className="form-grid">
                                        <div>
                                            <label className="field-label">Ders Adı</label>
                                            <input
                                                className="field-input"
                                                placeholder="ör. Matematik"
                                                value={lessonName}
                                                onChange={e => setLessonName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="field-label">Başlık</label>
                                            <input
                                                className="field-input"
                                                placeholder="Not başlığı"
                                                value={title}
                                                onChange={e => setTitle(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="field-label">Kısa Açıklama</label>
                                            <input
                                                className="field-input"
                                                placeholder="Kısa bir açıklama..."
                                                value={description}
                                                onChange={e => setDescription(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="field-label">Not İçeriği</label>
                                            <textarea
                                                className="field-textarea"
                                                placeholder="Not içeriğini buraya yaz..."
                                                value={content}
                                                onChange={e => setContent(e.target.value)}
                                                rows={4}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <div className="file-zone">
                                                <input type="file" onChange={handleFileChange} />
                                                {filePath && <span className="file-name">{filePath}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            className={`btn-save ${editingNoteId ? 'edit-mode' : 'new-mode'}`}
                                            onClick={handleSaveProcess}
                                        >
                                            {editingNoteId ? "Değişiklikleri Kaydet" : "Notu Sisteme Kaydet"}
                                        </button>
                                        {editingNoteId && (
                                            <button className="btn-cancel" onClick={clearForm}>İptal</button>
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* LIST */}
                            <div className="list-header">
                                <span className="list-title">
                                    {showTrash ? "🗑️ Çöp Kutusu" : "📑 Notlarım"}
                                </span>
                                <span className="list-count">
                                    {(showTrash ? trash : notes).length} öğe
                                </span>
                            </div>

                            <div className="notes-list">
                                {(showTrash ? trash : notes).length === 0 ? (
                                    <div className="empty-state">
                                        {showTrash ? "Çöp kutusu boş." : "Henüz not eklenmedi."}
                                    </div>
                                ) : (
                                    (showTrash ? trash : notes).map((note, i) => (
                                        <div
                                            key={note.id}
                                            className="note-card"
                                            style={{ animationDelay: `${i * 0.05}s` }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <div className="note-meta">
                                                    <span className="note-lesson-badge">{note.lessonName}</span>
                                                </div>
                                                <div className="note-title">{note.title}</div>
                                                <div className="note-preview">{note.content}</div>
                                            </div>

                                            <div className="note-actions">
                                                {showTrash ? (
                                                    <>
                                                        <button className="btn-note btn-restore" onClick={() => handleAction(note.id, 'restore')}>Geri Yükle</button>
                                                        <button className="btn-note btn-hard-delete" onClick={() => handleAction(note.id, 'hard')}>Kalıcı Sil</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button className="btn-note btn-edit" onClick={() => handleEditInitiate(note)}>Düzenle</button>
                                                        <button className="btn-note btn-delete" onClick={() => handleAction(note.id, 'soft')}>Çöpe At</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}

                    <footer className="dash-footer">FathWeb Notlarım &copy; 2026</footer>
                </div>
            </div>
        </>
    );
}