'use client';

import { useState, useEffect } from 'react';
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
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

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

  if (!open) return null;

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('As senhas nao coincidem');
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

  return (
    <div className="auth-modal">
      <div className="auth-modal-backdrop" onClick={onClose}></div>

      <div className="auth-modal-card">
        <div className="auth-modal-header" id='tpp'>
          <div>
            <p className="auth-modal-brand">RuzziStore</p>
            <h2 className="auth-modal-title">
              {tab === 'login' ? 'Entrar na conta' : 'Criar conta'}
            </h2>
          </div>
          <button onClick={onClose} className="auth-modal-close">x</button>
        </div>

      <div
  className="auth-modal-tabs"
  id="sec"
  style={{
    background: tab === 'login'
      ? 'linear-gradient(to right, #03387d 50%, #022227 50%)'
      : 'linear-gradient(to left, #03387d 50%, #022227 50%)'
  }}
>
  <button id='ftbtn'
    className={`auth-modal-tab ${tab === 'login' ? 'auth-modal-tab-active' : 'auth-modal-tab-inactive'}`}
    onClick={() => setTab('login')}
  >
    Entrar
  </button>
  <button id='ftbtn'
    className={`auth-modal-tab ${tab === 'register' ? 'auth-modal-tab-active' : 'auth-modal-tab-inactive'}`}
    onClick={() => setTab('register')}
  >
    Criar conta
  </button>
</div>

        {tab === 'login' ? (
              <div id='all2'>
          <form onSubmit={handleLogin} className="auth-modal-form">
            <div className='txtLg'>Bem-vindo de volta!</div>
            <div className='ett' id='et3'>
               <label typeof="input" className="text">Email:</label>
            <input
              type="email"
         
              required
              className="auth-modal-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            </div>
             <div className='ett' id='et42'>
               <label typeof="input" className="text">Senha:</label>
            <input
              type="password"
             
              required
              className="auth-modal-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            /></div>
               <div className='btn' id='btnSecd'>
            <button type="submit" disabled={loading} className="auth-modal-submit" >
              {loading ? <Loader /> : 'Entrar'}
            </button>
            </div>
          </form>
          </div>
        ) : (
          <div id='all'>
          <form onSubmit={handleRegister} className="auth-modal-form">
           <div className='ett' id='et1'>
             <label typeof="input" className="text">Name:</label>
            <input
           name="input" 
              type="text"
        
              required
              className="auth-modal-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            /> </div>
            <div className="space-y-2" id='arq'>
              <input
        
                type="file"
                accept="image/*"
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
             <div className='ett' id='et2'>
               <label typeof="input" className="text">Email:</label>
            <input
      
              type="email"
           
              required
              className="auth-modal-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            </div>
             <div className='ett' id='et3'>
               <label typeof="input" className="text">Senha:</label>
            <input
       
              type="password"
             
              required
              className="auth-modal-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            </div>
             <div className='ett' id='et4'>
               <label typeof="input" className="text">Confirme a senha:</label>
            <input
           
              type="password"
           
              required
              className="auth-modal-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            /></div>
            <div className='btn'>
            <button type="submit" disabled={loading} className="auth-modal-submit">
              {loading ? <Loader /> : 'Criar conta'}
            </button>
            </div>
          </form>
          </div>
        )}
      </div>
    </div>
  );
}
