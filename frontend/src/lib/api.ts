const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request<T>(
  endpoint: string,
  method: HttpMethod,
  body?: any,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('@RuzziStore:token')
      : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  if (response.status === 204) {
    return null as T;
  }

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Erro na requisição');
  }

  return data as T;
}

const api = {
  get<T>(endpoint: string, options?: RequestInit) {
    return request<T>(endpoint, 'GET', undefined, options);
  },

  post<T>(endpoint: string, body: any, options?: RequestInit) {
    return request<T>(endpoint, 'POST', body, options);
  },

  put<T>(endpoint: string, body: any, options?: RequestInit) {
    return request<T>(endpoint, 'PUT', body, options);
  },

  delete<T>(endpoint: string, options?: RequestInit) {
    return request<T>(endpoint, 'DELETE', undefined, options);
  },
};

export default api;
