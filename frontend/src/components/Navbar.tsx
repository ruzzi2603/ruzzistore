'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Library } from 'lucide-react';
import { useEffect, useState } from 'react';
import UserMenu from './UserMenu';

export default function Navbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 10) {
        setIsVisible(true);
      } else if (currentY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
