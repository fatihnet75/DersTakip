"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Geri/ileri navigasyonda localStorage temizle, login'e yönlendir
        localStorage.removeItem("UserId");
        localStorage.removeItem("Username");
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .home-root {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Sora', sans-serif;
                    background: #0a0a0f;
                    position: relative;
                    overflow: hidden;
                }

                .home-root::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(ellipse 80% 60% at 15% 20%, rgba(59,130,246,0.13) 0%, transparent 60%),
                        radial-gradient(ellipse 60% 80% at 85% 80%, rgba(139,92,246,0.11) 0%, transparent 60%),
                        radial-gradient(ellipse 40% 40% at 50% 50%, rgba(16,185,129,0.04) 0%, transparent 70%);
                    z-index: 0;
                }

                .home-root::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
                    background-size: 48px 48px;
                    z-index: 0;
                }

                .home-card {
                    position: relative;
                    z-index: 1;
                    width: 480px;
                    max-width: calc(100vw - 40px);
                    background: rgba(16,16,24,0.85);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 22px;
                    padding: 56px 44px 48px;
                    backdrop-filter: blur(24px);
                    box-shadow:
                        0 0 0 1px rgba(59,130,246,0.08),
                        0 32px 64px rgba(0,0,0,0.55),
                        0 0 100px rgba(59,130,246,0.06);
                    text-align: center;
                    animation: cardIn 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
                }

                @keyframes cardIn {
                    from { opacity: 0; transform: translateY(32px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }

                /* Brand */
                .home-brand {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 11px;
                    margin-bottom: 40px;
                    animation: fadeUp 0.5s 0.1s both;
                }

                .home-brand-icon {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 15px;
                    font-weight: 500;
                    color: #fff;
                }

                .home-brand-name {
                    font-size: 20px;
                    font-weight: 700;
                    color: #f1f5f9;
                    letter-spacing: -0.4px;
                }

                .home-brand-name span {
                    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                /* Badge */
                .home-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(16,185,129,0.1);
                    border: 1px solid rgba(16,185,129,0.2);
                    color: #34d399;
                    font-size: 10.5px;
                    font-family: 'JetBrains Mono', monospace;
                    font-weight: 500;
                    letter-spacing: 0.8px;
                    text-transform: uppercase;
                    padding: 5px 14px;
                    border-radius: 20px;
                    margin-bottom: 24px;
                    animation: fadeUp 0.5s 0.15s both;
                }

                .badge-dot {
                    width: 6px;
                    height: 6px;
                    background: #34d399;
                    border-radius: 50%;
                    animation: blink 1.8s ease-in-out infinite;
                }

                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }

                /* Heading */
                .home-heading {
                    font-size: 32px;
                    font-weight: 800;
                    color: #f8fafc;
                    letter-spacing: -1px;
                    line-height: 1.2;
                    margin-bottom: 14px;
                    animation: fadeUp 0.5s 0.2s both;
                }

                .home-heading span {
                    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .home-desc {
                    font-size: 14px;
                    color: #475569;
                    line-height: 1.7;
                    margin-bottom: 40px;
                    animation: fadeUp 0.5s 0.25s both;
                }

                /* CTA Button */
                .home-cta {
                    display: block;
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
                    border: none;
                    border-radius: 13px;
                    color: #fff;
                    font-size: 15px;
                    font-weight: 700;
                    font-family: 'Sora', sans-serif;
                    letter-spacing: -0.2px;
                    cursor: pointer;
                    text-decoration: none;
                    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
                    box-shadow: 0 4px 22px rgba(59,130,246,0.38);
                    margin-bottom: 14px;
                    animation: fadeUp 0.5s 0.3s both;
                }

                .home-cta:hover {
                    opacity: 0.92;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(59,130,246,0.48);
                }

                .home-cta:active {
                    transform: translateY(0);
                    opacity: 1;
                }

                .home-register-link {
                    font-size: 13px;
                    color: #475569;
                    animation: fadeUp 0.5s 0.35s both;
                    display: block;
                }

                .home-register-link a {
                    color: #60a5fa;
                    font-weight: 500;
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .home-register-link a:hover {
                    color: #93c5fd;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }

                /* Divider */
                .home-divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 32px 0 28px;
                    animation: fadeUp 0.5s 0.28s both;
                }

                .divider-line {
                    flex: 1;
                    height: 1px;
                    background: rgba(255,255,255,0.06);
                }

                .divider-text {
                    font-size: 10.5px;
                    color: #334155;
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: 0.5px;
                }

                /* Features */
                .home-features {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    animation: fadeUp 0.5s 0.32s both;
                }

                .feature-item {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 11px;
                    padding: 14px 10px;
                    text-align: center;
                }

                .feature-icon {
                    font-size: 18px;
                    margin-bottom: 6px;
                    display: block;
                }

                .feature-label {
                    font-size: 10.5px;
                    color: #475569;
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: 0.3px;
                }

                /* Footer */
                .home-footer {
                    margin-top: 32px;
                    font-size: 9.5px;
                    color: #1e293b;
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    animation: fadeUp 0.5s 0.4s both;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="home-root">
                <div className="home-card">

                    <div className="home-brand">
                        <div className="home-brand-icon">T</div>
                        <div className="home-brand-name"><span>Fatih</span>web</div>
                    </div>

                    <div className="home-badge">
                        <span className="badge-dot" />
                        Sistem Aktif
                    </div>

                    <h1 className="home-heading">
                        Ders notlarını<br />
                        <span>akıllıca yönet</span>
                    </h1>

                    <p className="home-desc">
                        Tüm ders notlarını tek bir yerde sakla, düzenle ve istediğin zaman eriş. Hızlı, güvenli ve sade.
                    </p>

                    <Link href="/login" className="home-cta">
                        Sisteme Giriş Yap →
                    </Link>

                    <span className="home-register-link">
                        Hesabın yok mu?{" "}
                        <Link href="/register">Ücretsiz Kayıt Ol</Link>
                    </span>

                    <div className="home-divider">
                        <div className="divider-line" />
                        <span className="divider-text">özellikler</span>
                        <div className="divider-line" />
                    </div>

                    <div className="home-features">
                        <div className="feature-item">
                            <span className="feature-icon">📑</span>
                            <div className="feature-label">Not Yönetimi</div>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🗑️</span>
                            <div className="feature-label">Çöp Kutusu</div>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📁</span>
                            <div className="feature-label">Dosya Ekleme</div>
                        </div>
                    </div>

                    <div className="home-footer">FatihWeb &copy; 2026</div>
                </div>
            </div>
        </>
    );
}