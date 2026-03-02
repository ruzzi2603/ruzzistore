'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/components/context/AuthContext';
import Loader from '@/components/Loader';

interface AuthModalProps {
  open: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
}

export default function AuthModal({ open, initialTab = 'login', onClose }: AuthModalProps) {
  const { signIn } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [open]);

  if (!mounted || !open) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn({ email, password });
      onClose();
    } catch {
      toast.error('Falha no login');
    } finally {
      setLoading(false);
    }
  };

  const passwordValid = (pwd: string) => {
    // mínimo 8 caracteres, uma maiúscula e um número
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    if (!passwordValid(password)) {
      toast.error('Senha deve ter ≥8 caracteres, uma maiúscula e um número');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password, avatar });
      await signIn({ email, password });
      onClose();
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarFile = async (file?: File) => {
    if (!file) return;
    setAvatarUploading(true);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      // fallback para base64 (dev)
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
        setAvatarUploading(false);
      };
      reader.readAsDataURL(file);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Imagem muito grande (max 2MB)');
      setAvatarUploading(false);
      return;
    }

    try {
      const form = new FormData();
      form.append('file', file);
      form.append('upload_preset', uploadPreset);
      form.append('folder', 'ruzzistore/avatars');

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        throw new Error('Falha no upload');
      }

      const data = await res.json();
      setAvatar(data.secure_url || data.url || '');
    } catch {
      toast.error('Erro ao enviar imagem');
    } finally {
      setAvatarUploading(false);
    }
  };

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70" onClick={onClose}></div>
      <div className="relative bg-(--surface) max-w-md w-full rounded-xl shadow-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">RuzziStore</p>
            <h2 className="text-lg font-bold text-white mt-1">
              {tab === 'login' ? 'Entrar na conta' : 'Criar conta'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-2xl leading-none">
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 bg-slate-800/50">
          <button 
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${tab === 'login' ? 'text-cyan-300 border-b-2 border-cyan-300' : 'text-slate-400 hover:text-slate-300'}`}
            onClick={() => setTab('login')}
          >
            Entrar
          </button>
          <button 
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${tab === 'register' ? 'text-cyan-300 border-b-2 border-cyan-300' : 'text-slate-400 hover:text-slate-300'}`}
            onClick={() => setTab('register')}
          >
            Criar conta
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto flex-1">
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="auth-modal-form space-y-4">
              <p className="text-xl font-medium text-white">Bem-vindo de volta!</p>

              <div className="flex flex-col">
                <label className="text-sm text-slate-300 mb-1" htmlFor="email-login">
                  Email
                </label>
                <input
                  id="email-login"
                  type="email"
                  placeholder="seu@email.com"
                  aria-label="Email"
                  required
                  className="auth-modal-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-slate-300 mb-1" htmlFor="password-login">
                  Senha
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password-login"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="sua senha segura"
                    aria-label="Senha"
                    required
                    className="auth-modal-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-200"
                    title={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={loading} className="auth-modal-submit px-6 py-2" id='btnCR'>
                  {loading ? <Loader /> : 'Entrar'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-modal-form space-y-4">
              <p className="text-xl font-medium text-white">Crie sua conta</p>

              <div className="flex flex-col">
                <label className="text-sm text-slate-300 mb-1" htmlFor="name-register">
                  Nome completo
                </label>
                <input
                  id="name-register"
                  name="fullname"
                  type="text"
                  placeholder="seu nome completo"
                  aria-label="Nome completo"
                  required
                  className="auth-modal-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2" id='ft'>
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Enviar foto de perfil"
                  className="auth-modal-file"
                  onChange={(e) => handleAvatarFile(e.target.files?.[0])}
                />
                {avatar && (
                  <img src={avatar} alt="Preview" className="auth-modal-preview" />
                )}
                {avatarUploading && (
                  <p className="text-xs text-slate-400">Enviando imagem...</p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-slate-300 mb-1" htmlFor="email-register">
                  Email
                </label>
                <input
                  id="email-register"
                  type="email"
                  placeholder="seu@email.com"
                  aria-label="Email"
                  required
                  className="auth-modal-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-slate-300 mb-1" htmlFor="password-register">
                  Senha
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password-register"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Senha (≥8 caract., 1 maiúsc., 1 número)"
                    aria-label="Senha"
                    required
                    className="auth-modal-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-200"
                    title={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-slate-300 mb-1" htmlFor="confirm-password">
                  Confirmar senha
                </label>
                <div className="relative flex items-center">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="confirme sua senha"
                    aria-label="Confirmar senha"
                    required
                    className="auth-modal-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-200"
                    title={showConfirmPassword ? 'Esconder senha' : 'Mostrar senha'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={loading} className="auth-modal-submit px-6 py-2" id='btnCR'>
                  {loading ? <Loader /> : 'Criar conta'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

const portalTarget =
  typeof document !== 'undefined' ? document.body : undefined;

if (!portalTarget) return null;

return createPortal(modal, portalTarget);

}
