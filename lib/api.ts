const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class APIError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('auth_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new APIError(payload.error || 'Request failed', response.status);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getTransactions: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request(`/transactions${query}`);
  },
  addTransaction: (payload: {
    type: 'income' | 'expense';
    category: string;
    amount: number;
    description?: string;
    date: string;
  }) => request('/transactions', { method: 'POST', body: JSON.stringify(payload) }),
  getSummary: () => request('/summary'),
  getAIInsights: () => request('/ai-insights'),
  chat: (message: string) =>
    request('/ai-chat', { method: 'POST', body: JSON.stringify({ message }) }),
};
