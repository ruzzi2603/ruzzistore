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
      const currentY =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
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

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={`navbar ${isVisible ? 'translate-y-0' : '-translate-y-full'}`} aria-label="Navegação principal">
      <div className="navbar-inner">
        <div id='title'>
        <Link href="/" className="navbar-brand" aria-label="RuzziStore - Home">
          <span className="navbar-brand-text">
            RUZZI<span className="navbar-brand-accent">STORE</span>
          </span>
        </Link>
</div>
        <div className="navbar-links" role="navigation" aria-label="Menu de navegação">
          <Link
            href="/dashboard"
            className={`navbar-link ${isActive('/dashboard') ? 'navbar-link-active' : 'navbar-link-inactive'}`}
            aria-current={isActive('/dashboard') ? 'page' : undefined}
          >
            <LayoutDashboard size={18} aria-hidden="true" />
            Dashboard
          </Link>

          <Link
            href="/dashboard/library"
            className={`navbar-link ${pathname.startsWith('/dashboard/library') ? 'navbar-link-active' : 'navbar-link-inactive'}`}
            aria-current={pathname.startsWith('/dashboard/library') ? 'page' : undefined}
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                toast.error('Voce precisa logar para acessar a biblioteca.');
              }
            }}
          >
            <Library size={18} aria-hidden="true" />
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
