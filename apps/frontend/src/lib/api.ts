import { getAPIUrl } from './utils';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Get API URL dynamically
const getAPIURL = () => getAPIUrl();

export const api = {
  auth: {
    login: (data: { phone: string; password: string }) =>
      fetch(`${getAPIURL()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    register: (data: { phone: string; password: string; name?: string; email?: string }) =>
      fetch(`${getAPIURL()}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    sendOTP: (phone: string) =>
      fetch(`${getAPIURL()}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      }).then(async (r) => {
        if (!r.ok) {
          const error = await r.json();
          throw new Error(error.message || 'خطا در ارسال کد تایید');
        }
        return r.json();
      }),
    verifyOTP: (phone: string, code: string) =>
      fetch(`${getAPIURL()}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      }).then(async (r) => {
        if (!r.ok) {
          const error = await r.json();
          throw new Error(error.message || 'کد تایید نامعتبر است');
        }
        return r.json();
      }),
  },
  categories: {
    getAll: () => fetch(`${getAPIURL()}/api/categories`).then((r) => r.json()),
    getBySlug: (slug: string) =>
      fetch(`${getAPIURL()}/api/categories/slug/${slug}`).then((r) => r.json()),
  },
  cars: {
    getAll: (params?: { categoryId?: string; page?: number; limit?: number; published?: boolean }) => {
      const searchParams = new URLSearchParams();
      if (params?.categoryId) searchParams.append('categoryId', params.categoryId);
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.published !== undefined) searchParams.append('published', params.published.toString());
      return fetch(`${getAPIURL()}/api/cars?${searchParams}`).then((r) => r.json());
    },
    getBySlug: (slug: string) =>
      fetch(`${getAPIURL()}/api/cars/slug/${slug}`).then((r) => r.json()),
  },
  articles: {
    getAll: (params?: { published?: boolean; page?: number; limit?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.published !== undefined)
        searchParams.append('published', params.published.toString());
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      
      // Add timeout for fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      return fetch(`${getAPIURL()}/api/articles?${searchParams}`, {
        signal: controller.signal,
      })
        .then((r) => {
          clearTimeout(timeoutId);
          if (!r.ok) {
            throw new Error(`HTTP error! status: ${r.status}`);
          }
          return r.json();
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          if (error.name === 'AbortError') {
            console.warn('Request timeout for articles');
          } else {
            console.error('Error fetching articles:', error.message || error);
          }
          return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
        });
    },
    getBySlug: (slug: string) =>
      fetch(`${getAPIURL()}/api/articles/slug/${slug}`).then((r) => r.json()),
  },
  news: {
    getAll: (params?: { published?: boolean; page?: number; limit?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.published !== undefined)
        searchParams.append('published', params.published.toString());
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      
      // Add timeout for fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      return fetch(`${getAPIURL()}/api/news?${searchParams}`, {
        signal: controller.signal,
      })
        .then((r) => {
          clearTimeout(timeoutId);
          if (!r.ok) {
            throw new Error(`HTTP error! status: ${r.status}`);
          }
          return r.json();
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          if (error.name === 'AbortError') {
            console.warn('Request timeout for news');
          } else {
            console.error('Error fetching news:', error.message || error);
          }
          return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
        });
    },
    getBySlug: (slug: string) =>
      fetch(`${getAPIURL()}/api/news/slug/${slug}`).then((r) => r.json()),
  },
  contact: {
    send: (data: {
      name: string;
      email: string;
      phone?: string;
      subject: string;
      message: string;
    }) =>
      fetch(`${getAPIURL()}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  },
  tickets: {
    getAll: (status?: string) => {
      const searchParams = new URLSearchParams();
      if (status) searchParams.append('status', status);
      return fetch(`${getAPIURL()}/api/tickets?${searchParams}`, {
        headers: getAuthHeaders(),
      }).then((r) => r.json());
    },
    getOne: (id: string) =>
      fetch(`${getAPIURL()}/api/tickets/${id}`, {
        headers: getAuthHeaders(),
      }).then((r) => r.json()),
    create: (data: { title: string; description: string }) =>
      fetch(`${getAPIURL()}/api/tickets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    addMessage: (id: string, data: { content: string }) =>
      fetch(`${getAPIURL()}/api/tickets/${id}/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: { status?: string }) =>
      fetch(`${getAPIURL()}/api/tickets/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  },
  chat: {
    getMessages: (limit?: number) => {
      const searchParams = new URLSearchParams();
      if (limit) searchParams.append('limit', limit.toString());
      return fetch(`${getAPIURL()}/api/chat/messages?${searchParams}`, {
        headers: getAuthHeaders(),
      }).then((r) => r.json());
    },
    sendMessage: (data: { content: string }) =>
      fetch(`${getAPIURL()}/api/chat/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  },
  feedbacks: {
    getAll: (type?: string) => {
      const searchParams = new URLSearchParams();
      if (type) searchParams.append('type', type);
      return fetch(`${getAPIURL()}/api/feedbacks?${searchParams}`, {
        headers: getAuthHeaders(),
      }).then((r) => r.json());
    },
    create: (data: { type: string; message: string; rating?: number }) =>
      fetch(`${getAPIURL()}/api/feedbacks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  },
  pages: {
    getAll: (published?: boolean) => {
      const searchParams = new URLSearchParams();
      if (published !== undefined) searchParams.append('published', published.toString());
      return fetch(`${getAPIURL()}/api/pages?${searchParams}`, {
        headers: getAuthHeaders(),
      }).then((r) => r.json());
    },
    getPublic: () => fetch(`${getAPIURL()}/api/pages/public`).then((r) => r.json()),
    getBySlug: (slug: string) => fetch(`${getAPIURL()}/api/pages/public/${slug}`).then((r) => r.json()),
    getOne: (id: string) =>
      fetch(`${getAPIURL()}/api/pages/${id}`, {
        headers: getAuthHeaders(),
      }).then((r) => r.json()),
    create: (data: any) =>
      fetch(`${getAPIURL()}/api/pages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: any) =>
      fetch(`${getAPIURL()}/api/pages/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetch(`${getAPIURL()}/api/pages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then((r) => r.json()),
  },
  profile: {
    get: () =>
      fetch(`${getAPIURL()}/api/users/profile`, {
        headers: getAuthHeaders(),
      }).then((r) => r.json()),
    update: (data: { name?: string; email?: string; avatar?: string }) =>
      fetch(`${getAPIURL()}/api/users/profile`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    changePassword: (data: { oldPassword: string; newPassword: string }) =>
      fetch(`${getAPIURL()}/api/users/change-password`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  },
};
