import { API_URL } from './utils';

export const api = {
  categories: {
    getAll: () => fetch(`${API_URL}/api/categories`).then((r) => r.json()),
    getBySlug: (slug: string) =>
      fetch(`${API_URL}/api/categories/slug/${slug}`).then((r) => r.json()),
  },
  cars: {
    getAll: (params?: { categoryId?: string; page?: number; limit?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.categoryId) searchParams.append('categoryId', params.categoryId);
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
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
};

