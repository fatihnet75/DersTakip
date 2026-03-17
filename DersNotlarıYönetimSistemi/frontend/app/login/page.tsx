"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5227/api/Auth/login", {
                Email: email,
                Password: password,
            });

            const userData = res.data;
            const finalUserId = userData.userId || userData.UserId || userData.id || userData.Id;
            const finalUsername = userData.username || userData.Username || "Kullanıcı";

            if (finalUserId) {
                alert("Giriş başarılı!");
                localStorage.setItem("Username", finalUsername.toString());
                localStorage.setItem("UserId", finalUserId.toString());
                router.replace("/dashboard");
            } else {
                alert("Giriş yapıldı fakat kullanıcı bilgileri alınamadı. Lütfen Backend'i kontrol edin.");
                console.log("Backend'den gelen ham veri:", res.data);
            }
        } catch (error) {
            console.error("Login Hatası:");
            alert("Hata: ");
        }
    };

    useEffect(() => {
        localStorage.removeItem("UserId");
        localStorage.removeItem("Username");
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

                * { box-sizing: border-box; margin: 0; padding: 0; }

                .login-root {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Sora', sans-serif;
                    background: #0a0a0f;
                    position: relative;
                    overflow: hidden;
                }

                .login-root::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(ellipse 80% 60% at 20% 20%, rgba(59, 130, 246, 0.12) 0%, transparent 60%),
                        radial-gradient(ellipse 60% 80% at 80% 80%, rgba(139, 92, 246, 0.10) 0%, transparent 60%),
                        radial-gradient(ellipse 50% 50% at 50% 50%, rgba(16, 185, 129, 0.04) 0%, transparent 70%);
                    z-index: 0;
                }

                .login-root::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 48px 48px;
                    z-index: 0;
                }

                .login-card {
                    position: relative;
                    z-index: 1;
                    width: 420px;
                    background: rgba(16, 16, 24, 0.85);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px;
                    padding: 48px 40px;
                    backdrop-filter: blur(24px);
                    box-shadow:
                        0 0 0 1px rgba(59,130,246,0.08),
                        0 32px 64px rgba(0,0,0,0.5),
                        0 0 80px rgba(59,130,246,0.06);
                    animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
                }

                @keyframes cardIn {
                    from { opacity: 0; transform: translateY(28px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }

                .brand-area {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 32px;
                    animation: fadeUp 0.5s 0.1s both;
                }

                .brand-icon {
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 14px;
                    font-weight: 500;
                    color: #fff;
                    letter-spacing: -0.5px;
                }

                .brand-name {
                    font-size: 18px;
                    font-weight: 600;
                    color: #f1f5f9;
                    letter-spacing: -0.3px;
                }

                .brand-name span {
                    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .login-heading {
                    font-size: 26px;
                    font-weight: 700;
                    color: #f8fafc;
                    letter-spacing: -0.6px;
                    margin-bottom: 6px;
                    animation: fadeUp 0.5s 0.15s both;
                }

                .login-sub {
                    font-size: 13.5px;
                    color: #64748b;
                    margin-bottom: 32px;
                    animation: fadeUp 0.5s 0.2s both;
                }

                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    margin-bottom: 28px;
                }

                .field-wrapper {
                    position: relative;
                    animation: fadeUp 0.5s both;
                }
                .field-wrapper:nth-child(1) { animation-delay: 0.25s; }
                .field-wrapper:nth-child(2) { animation-delay: 0.30s; }

                .field-label {
                    display: block;
                    font-size: 11.5px;
                    font-weight: 500;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    margin-bottom: 7px;
                    font-family: 'JetBrains Mono', monospace;
                }

                .field-input {
                    width: 100%;
                    padding: 13px 16px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    color: #f1f5f9;
                    font-size: 14.5px;
                    font-family: 'Sora', sans-serif;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                }

                .field-input::placeholder {
                    color: #334155;
                }

                .field-input:focus {
                    border-color: rgba(59, 130, 246, 0.5);
                    background: rgba(59, 130, 246, 0.05);
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
                }

                .submit-btn {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
                    border: none;
                    border-radius: 12px;
                    color: #fff;
                    font-size: 15px;
                    font-weight: 600;
                    font-family: 'Sora', sans-serif;
                    letter-spacing: -0.2px;
                    cursor: pointer;
                    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
                    box-shadow: 0 4px 20px rgba(59,130,246,0.35);
                    animation: fadeUp 0.5s 0.35s both;
                }

                .submit-btn:hover {
                    opacity: 0.92;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 28px rgba(59,130,246,0.45);
                }

                .submit-btn:active {
                    transform: translateY(0);
                    opacity: 1;
                }

                .divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 24px 0 20px;
                    animation: fadeUp 0.5s 0.4s both;
                }

                .divider-line {
                    flex: 1;
                    height: 1px;
                    background: rgba(255,255,255,0.07);
                }

                .divider-text {
                    font-size: 11px;
                    color: #475569;
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: 0.5px;
                }

                .register-prompt {
                    text-align: center;
                    font-size: 13.5px;
                    color: #475569;
                    animation: fadeUp 0.5s 0.45s both;
                }

                .register-link {
                    color: #60a5fa;
                    cursor: pointer;
                    font-weight: 500;
                    transition: color 0.2s;
                }

                .register-link:hover {
                    color: #93c5fd;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="login-root">
                <div className="login-card">
                    <div className="brand-area">
                        <div className="brand-icon">T</div>
                        <div className="brand-name"><span>Giriş</span>Yap</div>
                    </div>

                    <h1 className="login-heading">Tekrar hoş geldin</h1>
                    <p className="login-sub">Devam etmek için giriş yapın.</p>

                    <form onSubmit={handleLogin}>
                        <div className="field-group">
                            <div className="field-wrapper">
                                <label className="field-label">E-posta</label>
                                <input
                                    type="email"
                                    className="field-input"
                                    placeholder="ornek@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="field-wrapper">
                                <label className="field-label">Şifre</label>
                                <input
                                    type="password"
                                    className="field-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="submit-btn">
                            Giriş Yap →
                        </button>
                    </form>

                    <div className="divider">
                        <div className="divider-line" />
                        <span className="divider-text">ya da</span>
                        <div className="divider-line" />
                    </div>

                    <p className="register-prompt">
                        Hesabınız yok mu?{" "}
                        <span
                            className="register-link"
                            onClick={() => router.push("/register")}
                        >
                            Kayıt Ol
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
}