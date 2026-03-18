import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * CONFIGURAÃ‡ÃƒO DE ROTAS
 * Adicione aqui caminhos que qualquer pessoa pode acessar sem estar logada.
 */
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/api', // Geralmente APIs tÃªm sua prÃ³pria proteÃ§Ã£o ou sÃ£o pÃºblicas
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. IGNORAR ARQUIVOS ESTÃTICOS (OtimizaÃ§Ã£o de Performance)
  // Isso evita que o middleware processe imagens, fontes e scripts internos do Next.js
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    pathname.includes('/static') ||
    pathname.includes('.') || // Captura extensÃµes como .ico, .png, etc.
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. RECUPERAÃ‡ÃƒO DO TOKEN
  const token = req.cookies.get('arenagames.token')?.value;

  // 3. VERIFICAÃ‡ÃƒO DE ROTAS
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  );
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  // LÃ“GICA: USUÃRIO NÃƒO AUTENTICADO
  if (!token) {
    // Se tentar acessar uma rota privada (Ex: /perfil, /admin, /carrinho), manda pro login
    if (!isPublicRoute) {
      const loginUrl = new URL('/login', req.url);
      // Adiciona o parÃ¢metro 'callback' para o usuÃ¡rio voltar de onde parou apÃ³s o login
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Se for rota pÃºblica e nÃ£o tem token, deixa passar
    return NextResponse.next();
  }

  // LÃ“GICA: USUÃRIO AUTENTICADO
  if (token && isAuthPage) {
    // Se jÃ¡ estÃ¡ logado e tenta ir para Login ou Register, redireciona para a Home
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

/**
 * MATCHER
 * Define em quais caminhos o middleware deve rodar.
 * A regex abaixo exclui arquivos internos e estÃ¡ticos por padrÃ£o.
 */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
