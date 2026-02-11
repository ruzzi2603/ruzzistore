import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * CONFIGURAÇÃO DE ROTAS
 * Adicione aqui caminhos que qualquer pessoa pode acessar sem estar logada.
 */
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/api', // Geralmente APIs têm sua própria proteção ou são públicas
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. IGNORAR ARQUIVOS ESTÁTICOS (Otimização de Performance)
  // Isso evita que o middleware processe imagens, fontes e scripts internos do Next.js
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    pathname.includes('/static') ||
    pathname.includes('.') || // Captura extensões como .ico, .png, etc.
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. RECUPERAÇÃO DO TOKEN
  const token = req.cookies.get('ruzzistore.token')?.value;

  // 3. VERIFICAÇÃO DE ROTAS
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  );
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  // LÓGICA: USUÁRIO NÃO AUTENTICADO
  if (!token) {
    // Se tentar acessar uma rota privada (Ex: /perfil, /admin, /carrinho), manda pro login
    if (!isPublicRoute) {
      const loginUrl = new URL('/login', req.url);
      // Adiciona o parâmetro 'callback' para o usuário voltar de onde parou após o login
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Se for rota pública e não tem token, deixa passar
    return NextResponse.next();
  }

  // LÓGICA: USUÁRIO AUTENTICADO
  if (token && isAuthPage) {
    // Se já está logado e tenta ir para Login ou Register, redireciona para a Home
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

/**
 * MATCHER
 * Define em quais caminhos o middleware deve rodar.
 * A regex abaixo exclui arquivos internos e estáticos por padrão.
 */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};