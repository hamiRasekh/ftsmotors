import { API_URL } from './utils';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  auth: {
    login: (data: { phone: string; password: string }) =>
      fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    register: (data: { phone: string; password: string; name?: string; email?: string }) =>
      fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  },
  categories: {
    getAll: () => fetch(`${API_URL}/api/categories`).then((r) => r.json()),
    getBySlug: (slug: string) =>
      fetch(`${API_URL}/api/categories/slug/${slug}`).then((r) => r.json()),
  },
  cars: {
    getAll: (params?: { categoryId?: string; page?: number; limit?: number; published?: boolean }) => {
      const searchParams = new URLSearchParams();
      if (params?.categoryId) searchParams.append('categoryId', params.categoryId);
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.published !== undefined) searchParams.append('published', params.published.toString());
      return fetch(`${API_URL}/api/cars?${searchParams}`).then((r) => r.json());
    },
    getBySlug: (slug: string) =>
      fetch(`${API_URL}/api/cars/slug/${slug}`).then((r) => r.json()),
  },
  articles: {
    getAll: (params?: { published?: boolean; page?: number; limit?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.published !== undefined)
        searchParams.append('published', params.published.toString());
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      return fetch(`${API_URL}/api/articles?${searchParams}`).then((r) => r.json());
    },
    getBySlug: (slug: string) =>
      fetch(`${API_URL}/api/articles/slug/${slug}`).then((r) => r.json()),
  },
  news: {
    getAll: (params?: { published?: boolean; page?: number; limit?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.published !== undefined)
        searchParams.append('published', params.published.toString());
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      return fetch(`${API_URL}/api/news?${searchParams}`).then((r) => r.json());
    },
    getBySlug: (slug: string) =>
      fetch(`${API_URL}/api/news/slug/${slug}`).then((r) => r.json()),
  },
  contact: {
    send: (data: {
      name: string;
      email: string;
      phone?: string;
      subject: string;
      message: string;
    }) =>
      fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  },
  tickets: {
    getAll: (status?: string) => {
      const searchParams = new URLSearchParams();
      if (status) searchParams.append('status', status);
      return fetch(`${API_URL}/api/tickets?${searchParams}`, {
        headers: getAuthHeaders(),
      }).then((r) => r.json());
    },
    getOne: (id: string) =>
      fetch(`${API_URL}/api/tickets/${id}`, {
        headers: getAuthHeaders(),
      }).then((r) => r.json()),
    create: (data: { title: string; description: string }) =>
      fetch(`${API_URL}/api/tickets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    addMessage: (id: string, data: { content: string }) =>
      fetch(`${API_URL}/api/tickets/${id}/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: { status?: string }) =>
      fetch(`${API_URL}/api/tickets/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  },
  chat: {
    getMessages: (limit?: number) => {
      const searchParams = new URLSearchParams();
      if (limit) searchParams.append('limit', limit.toString());
      return fetch(`${API_URL}/api/chat/messages?${searchParams}`, {
        headers: getAuthHeaders(),
      }).then((r) => r.json());
    },
    sendMessage: (data: { content: string }) =>
      fetch(`${API_URL}/api/chat/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  },
  feedbacks: {
    getAll: (type?: string) => {
      const searchParams = new URLSearchParams();
      if (type) searchParams.append('type', type);
      return fetch(`${API_URL}/api/feedbacks?${searchParams}`, {
        headers: getAuthHeaders(),
      }).then((r) => r.json());
    },
    create: (data: { type: string; message: string; rating?: number }) =>
      fetch(`${API_URL}/api/feedbacks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  },
  pages: {
    getAll: (published?: boolean) => {
      const searchParams = new URLSearchParams();
      if (published !== undefined) searchParams.append('published', published.toString());
      return fetch(`${API_URL}/api/pages?${searchParams}`, {
        headers: getAuthHeaders(),
      }).then((r) => r.json());
    },
    getPublic: () => fetch(`${API_URL}/api/pages/public`).then((r) => r.json()),
    getBySlug: (slug: string) => fetch(`${API_URL}/api/pages/public/${slug}`).then((r) => r.json()),
    getOne: (id: string) =>
      fetch(`${API_URL}/api/pages/${id}`, {
        headers: getAuthHeaders(),
      }).then((r) => r.json()),
    create: (data: any) =>
      fetch(`${API_URL}/api/pages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: any) =>
      fetch(`${API_URL}/api/pages/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetch(`${API_URL}/api/pages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then((r) => r.json()),
  },
};
