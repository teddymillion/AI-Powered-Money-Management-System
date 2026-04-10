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
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new APIError(payload.error || 'Request failed', response.status);
  }
  return response.json() as Promise<T>;
}

export const api = {
  // Transactions
  getTransactions: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request(`/transactions${query}`);
  },
  addTransaction: (payload: { type: 'income'|'expense'; category: string; amount: number; description?: string; date: string }) =>
    request('/transactions', { method: 'POST', body: JSON.stringify(payload) }),

  // Summary & AI
  getSummary:    () => request('/summary'),
  getAIInsights: () => request('/ai-insights'),
  chat:          (message: string) => request('/ai-chat', { method: 'POST', body: JSON.stringify({ message }) }),

  // Auth
  requestOTP:    (email: string, password: string) =>
    request('/auth/login/request-otp', { method: 'POST', body: JSON.stringify({ email, password }) }),
  verifyOTP:     (email: string, otp: string) =>
    request('/auth/login/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
  resendOTP:     (email: string) =>
    request('/auth/resend-otp', { method: 'POST', body: JSON.stringify({ email }) }),
  register:      (name: string, email: string, password: string, confirmPassword: string) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, confirmPassword }) }),
  forgotPassword: (email: string) =>
    request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword:  (email: string, token: string, password: string, confirmPassword: string) =>
    request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, token, password, confirmPassword }) }),
  getMe:         () => request('/auth/me'),

  // Profile
  getProfile:      () => request('/profile'),
  updateProfile:   (data: { name?: string; email?: string }) =>
    request('/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  changePassword:  (currentPassword: string, newPassword: string, confirmPassword: string) =>
    request('/profile/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword, confirmPassword }) }),
  uploadAvatar:    (file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    return request('/profile/avatar', { method: 'POST', body: form });
  },

  // Notifications
  getNotifications:    () => request('/profile/notifications'),
  markNotificationRead: (id: string) => request(`/profile/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead:         () => request('/profile/notifications/read-all', { method: 'PATCH' }),

  deleteAccount: () =>
    request('/profile/account', { method: 'DELETE' }),
  getGoals:    () => request('/goals'),
  createGoal:  (data: { name: string; target: number; current?: number; icon?: string; deadline?: string }) =>
    request('/goals', { method: 'POST', body: JSON.stringify(data) }),
  updateGoal:  (id: string, data: Partial<{ name: string; target: number; current: number; icon: string; deadline: string }>) =>
    request(`/goals/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteGoal:  (id: string) => request(`/goals/${id}`, { method: 'DELETE' }),
};
