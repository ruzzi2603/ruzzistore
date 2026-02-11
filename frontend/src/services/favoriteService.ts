import Cookies from 'js-cookie';

/**
 * Função para alternar o status de favorito de um jogo no backend.
 * @param gameId ID do jogo que será favoritado/desfavoritado
 */
export const toggleFavoriteApi = async (gameId: string) => {
  // 1. Obtém o token JWT salvo nos cookies pelo processo de login
  const token = Cookies.get('ruzzistore.token');

  // 2. Faz a chamada para o endpoint que criamos no NestJS
  const response = await fetch(`http://localhost:3001/favorites/${gameId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // O Bearer Token é essencial para o JwtAuthGuard do NestJS funcionar
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({}),
  });

  // 3. Tratamento de respostas
  if (!response.ok) {
    // Caso o token seja inválido ou tenha expirado (401 Unauthorized)
    if (response.status === 401) {
      throw new Error('Sessão expirada ou usuário não autenticado.');
    }

    // Caso o jogo não exista ou erro no banco (404 ou 500)
    throw new Error('Não foi possível atualizar o favorito.');
  }

  return response.json();
};

/**
 * Busca a lista de IDs de jogos favoritos do usuário logado.
 * Útil para marcar os corações ao carregar a página.
 */
export const getMyFavoriteIdsApi = async () => {
  const token = Cookies.get('ruzzistore.token');

  if (!token) return [];

  const response = await fetch('http://localhost:3001/favorites/ids', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) return [];

  return response.json(); // Espera-se um array de strings ['id1', 'id2']
};
