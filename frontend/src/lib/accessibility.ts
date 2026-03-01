import { useEffect, useRef } from 'react';

/**
 * Hook para melhorar navegação por teclado
 * Permite usar Tab, Shift+Tab e Enter para navegação
 */
export function useKeyboardNavigation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tecla de escape para fechar modais/menus
      if (e.key === 'Escape') {
        const focusedElement = document.activeElement as HTMLElement;
        if (focusedElement?.classList.contains('modal')) {
          focusedElement.style.display = 'none';
        }
      }

      // Alt + S para focar na busca
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement;
        searchInput?.focus();
      }

      // Alt + F para abrir filtros
      if (e.altKey && e.key === 'f') {
        e.preventDefault();
        const filterButton = document.querySelector('[aria-controls="filters-panel"]') as HTMLButtonElement;
        filterButton?.click();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return ref;
}

/**
 * Configurar skip links e melhorias de acessibilidade
 */
export function setupAccessibilityFeatures() {
  // Adicionar skip links se não existirem
  const skipLinkExists = document.getElementById('skip-to-main');
  if (!skipLinkExists) {
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-to-main';
    skipLink.href = '#main';
    skipLink.className = 'sr-only focus:not-sr-only';
    skipLink.textContent = 'Pular para conteúdo principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Melhorar contraste de foco
  const style = document.createElement('style');
  style.textContent = `
    *:focus-visible {
      outline: 2px solid #22d3ee !important;
      outline-offset: 2px !important;
    }
    
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
    
    .sr-only.focus\\:not-sr-only:focus,
    .sr-only.focus\\:not-sr-only:focus-visible {
      position: static;
      width: auto;
      height: auto;
      padding: inherit;
      margin: inherit;
      overflow: visible;
      clip: auto;
      white-space: normal;
    }
  `;
  document.head.appendChild(style);
}
