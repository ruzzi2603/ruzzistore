'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Library } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import UserMenu from './UserMenu';
import { useAuth } from '@/components/context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Navbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;

      if (currentY < 10) {
        setIsVisible(true);
      } else if (currentY < lastY) {
        // Subiu a tela, mesmo pouco: navbar reaparece.
        setIsVisible(true);
      } else if (currentY > lastY) {
        // Desceu a tela: navbar some.
        setIsVisible(false);
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={`navbar ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="navbar-inner">
        <div id='title'>
        <Link href="/" className="navbar-brand">
          <span className="navbar-brand-text">
            RUZZI<span className="navbar-brand-accent">STORE</span>
          </span>
        </Link>
</div>
        <div className="navbar-links">
          <Link
            href="/dashboard"
            className={`navbar-link ${isActive('/dashboard') ? 'navbar-link-active' : 'navbar-link-inactive'}`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/library"
            className={`navbar-link ${pathname.startsWith('/dashboard/library') ? 'navbar-link-active' : 'navbar-link-inactive'}`}
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                toast.error('Voce precisa logar para acessar a biblioteca.');
              }
            }}
          >
            <Library size={18} />
            Biblioteca
          </Link>
        </div>

        <div className="navbar-user">
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
