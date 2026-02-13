'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/context/AuthContext';
import { User, Settings, LogOut, ChevronDown, Library, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import logarImg from '@/img/logar.png';

export default function UserMenu() {
  const { user, signOut: logout, updateUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [avatarInput, setAvatarInput] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openAuth = (tab: 'login' | 'register') => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const handleAvatarFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarInput(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarSave = async () => {
    try {
      const updated = await api.post<{ id: string; name: string; email: string; avatar?: string; createdAt?: string }>(
        '/users/avatar',
        { avatar: avatarInput },
      );
      updateUser(updated);
      toast.success('Foto atualizada');
    } catch {
      toast.error('Erro ao atualizar foto');
    }
  };

  if (!user) {
    return (
      <div className="user-menu-auth">
        <button onClick={() => openAuth('login')} className="user-menu-login">
          <Image src={logarImg} id='ImgLgFr' alt="Logar" width={36} height={32}  priority />
        </button>
        <AuthModal open={authOpen} initialTab={authTab} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="user-menu-button">
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0f1720&color=22d3ee`}
          alt={user.name}
          className="user-menu-avatar"
        />
        
        <span className="user-menu-name">{user.name.split(' ')[0]}</span>
        <ChevronDown size={14} className={`user-menu-chevron ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="user-menu-dropdown"
          >
          <div id='menu'>
            <div className="user-menu-header">
              <p className="user-menu-header-label">Conta</p>
              <p className="user-menu-header-email">{user.email}</p>
              {user.createdAt && (
                <p className="user-menu-header-date">Entrou em {new Date(user.createdAt).toLocaleDateString()}</p>
              )}
            </div>

          

            <Link href="/profile" onClick={() => setIsOpen(false)} className="user-menu-link">
              <User size={18} />
              <span>Meu Perfil</span>
            </Link>

            <Link href="/dashboard/library" onClick={() => setIsOpen(false)} className="user-menu-link">
              <Library size={18} />
              <span>Minha Biblioteca</span>
            </Link>

            <Link href="/profile/settings" onClick={() => setIsOpen(false)} className="user-menu-link">
              <Settings size={18} />
              <span>Configuracoes</span>
            </Link>

            <div className="user-menu-logout-wrap">
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="user-menu-logout"
              >
                <LogOut size={18} />
                <span className="user-menu-logout-text">Sair da conta</span>
              </button>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
    
  );
}
