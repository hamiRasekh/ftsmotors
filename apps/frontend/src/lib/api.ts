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
    getAll: async () => {
      try {
        const apiUrl = getAPIURL();
        const url = `${apiUrl}/api/categories`;
        
        // For server-side rendering, use Next.js fetch with cache
        const isServer = typeof window === 'undefined';
        
        // Log API URL in development or when debugging
        if (isServer && (process.env.NODE_ENV !== 'production' || process.env.DEBUG_API === 'true')) {
          console.log('[API] Categories: Fetching from URL:', url);
        }
        
        const fetchOptions: RequestInit = {
          headers: {
            'Content-Type': 'application/json',
          },
          // Next.js cache options for server-side
          ...(isServer && {
            cache: 'no-store', // Always fetch fresh data on server
            next: { revalidate: 60 }, // Revalidate every 60 seconds
          }),
        };
        
        const response = await fetch(url, fetchOptions);
        
        // Check if response is ok
        if (!response.ok) {
          const errorMsg = `HTTP Error ${response.status}: ${response.statusText} for ${url}`;
          if (isServer || process.env.NODE_ENV !== 'production') {
            console.error('[API] Categories:', errorMsg);
          }
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
          }
          return [];
        }
        
        // Parse JSON response
        let data;
        try {
          data = await response.json();
        } catch (error) {
          const errorMsg = 'Error parsing JSON response';
          if (isServer || process.env.NODE_ENV !== 'production') {
            console.error('[API] Categories:', errorMsg, error);
          }
          return [];
        }
        
        // Check if response is an error object
        if (data.statusCode && data.statusCode >= 400) {
          const errorMsg = data.message || 'خطا در دریافت دسته‌بندی‌ها';
          if (isServer || process.env.NODE_ENV !== 'production') {
            console.error('[API] Categories:', errorMsg);
          }
          return [];
        }
        
        // Return data (could be array or object with data property)
        return Array.isArray(data) ? data : (data.data || []);
      } catch (error: any) {
        const isServer = typeof window === 'undefined';
        const errorMsg = error.message || String(error);
        if (isServer || process.env.NODE_ENV !== 'production') {
          console.error('[API] Categories: Error fetching categories:', errorMsg);
        }
        return [];
      }
    },
    getBySlug: async (slug: string) => {
      try {
        const response = await fetch(`${getAPIURL()}/api/categories/slug/${slug}`);
        const data = await response.json();
        
        if (data.statusCode && data.statusCode >= 400) {
          throw new Error(data.message || 'دسته‌بندی یافت نشد');
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return data;
      } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
      }
    },
  },
  cars: {
    getAll: async (params?: { categoryId?: string; page?: number; limit?: number; published?: boolean }) => {
      try {
        const searchParams = new URLSearchParams();
        if (params?.categoryId) searchParams.append('categoryId', params.categoryId);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.published !== undefined) searchParams.append('published', params.published.toString());
        
        const apiUrl = getAPIURL();
        const url = `${apiUrl}/api/cars?${searchParams}`;
        
        // For server-side rendering, use Next.js fetch with cache
        const isServer = typeof window === 'undefined';
        
        // Log API URL in development or when debugging
        if (isServer && (process.env.NODE_ENV !== 'production' || process.env.DEBUG_API === 'true')) {
          console.log('[API] Cars: Fetching from URL:', url);
        }
        
        const fetchOptions: RequestInit = {
          headers: {
            'Content-Type': 'application/json',
          },
          // Next.js cache options for server-side
          ...(isServer && {
            cache: 'no-store', // Always fetch fresh data on server
            next: { revalidate: 60 }, // Revalidate every 60 seconds
          }),
        };
        
        const response = await fetch(url, fetchOptions);
        
        // Check if response is ok
        if (!response.ok) {
          const errorMsg = `HTTP Error ${response.status}: ${response.statusText} for ${url}`;
          if (isServer || process.env.NODE_ENV !== 'production') {
            console.error('[API] Cars:', errorMsg);
          }
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
          }
          return { data: [], total: 0, page: 1, limit: params?.limit || 20, totalPages: 0 };
        }
        
        // Parse JSON response
        let data;
        try {
          data = await response.json();
        } catch (error) {
          const errorMsg = 'Error parsing JSON response';
          if (isServer || process.env.NODE_ENV !== 'production') {
            console.error('[API] Cars:', errorMsg, error);
          }
          return { data: [], total: 0, page: 1, limit: params?.limit || 20, totalPages: 0 };
        }
        
        // Check if response is an error object
        if (data.statusCode && data.statusCode >= 400) {
          const errorMsg = data.message || 'خطا در دریافت خودروها';
          if (isServer || process.env.NODE_ENV !== 'production') {
            console.error('[API] Cars:', errorMsg);
          }
          return { data: [], total: 0, page: 1, limit: params?.limit || 20, totalPages: 0 };
        }
        
        // Return data with proper structure
        if (Array.isArray(data)) {
          return { data, total: data.length, page: 1, limit: params?.limit || 20, totalPages: 1 };
        }
        
        return {
          data: data.data || [],
          total: data.total || 0,
          page: data.page || 1,
          limit: data.limit || params?.limit || 20,
          totalPages: data.totalPages || 0,
        };
      } catch (error: any) {
        const isServer = typeof window === 'undefined';
        const errorMsg = error.message || String(error);
        if (isServer || process.env.NODE_ENV !== 'production') {
          console.error('[API] Cars: Error fetching cars:', errorMsg);
        }
        return { data: [], total: 0, page: 1, limit: params?.limit || 20, totalPages: 0 };
      }
    },
    getBySlug: async (slug: string) => {
      try {
        const response = await fetch(`${getAPIURL()}/api/cars/slug/${slug}`);
        const data = await response.json();
        
        if (data.statusCode && data.statusCode >= 400) {
          throw new Error(data.message || 'خودرو یافت نشد');
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return data;
      } catch (error) {
        console.error('Error fetching car:', error);
        throw error;
      }
    },
  },
  articles: {
    getAll: async (params?: { published?: boolean; page?: number; limit?: number }) => {
      try {
        const searchParams = new URLSearchParams();
        if (params?.published !== undefined)
          searchParams.append('published', params.published.toString());
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const apiUrl = getAPIURL();
        const url = `${apiUrl}/api/articles?${searchParams}`;
        
        // For server-side rendering, use Next.js fetch with cache
        const isServer = typeof window === 'undefined';
        
        // Log API URL in development or when debugging
        if (isServer && (process.env.NODE_ENV !== 'production' || process.env.DEBUG_API === 'true')) {
          console.log('[API] Articles: Fetching from URL:', url);
        }
        
        const fetchOptions: RequestInit = {
          headers: {
            'Content-Type': 'application/json',
          },
          // Next.js cache options for server-side
          ...(isServer && {
            cache: 'no-store', // Always fetch fresh data on server
            next: { revalidate: 60 }, // Revalidate every 60 seconds
          }),
        };
        
        // Add timeout only for client-side (setTimeout doesn't work well in server-side)
        let controller: AbortController | undefined;
        let timeoutId: NodeJS.Timeout | undefined;
        
        if (!isServer) {
          controller = new AbortController();
          timeoutId = setTimeout(() => controller!.abort(), 15000);
          fetchOptions.signal = controller.signal;
        }
        
        const response = await fetch(url, fetchOptions);
        
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        // Check if response is ok
        if (!response.ok) {
          const errorMsg = `HTTP Error ${response.status}: ${response.statusText} for ${url}`;
          if (isServer || process.env.NODE_ENV !== 'production') {
            console.error('[API] Articles:', errorMsg);
          }
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
          }
          return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
        }
        
        // Parse JSON response
        let data;
        try {
          data = await response.json();
        } catch (error) {
          const errorMsg = 'Error parsing JSON response';
          if (isServer || process.env.NODE_ENV !== 'production') {
            console.error('[API] Articles:', errorMsg, error);
          }
          return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
        }
        
        // Check if response is an error object
        if (data.statusCode && data.statusCode >= 400) {
          const errorMsg = data.message || 'خطا در دریافت مقالات';
          if (isServer || process.env.NODE_ENV !== 'production') {
            console.error('[API] Articles:', errorMsg);
          }
          return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
        }
        
        // Return data with proper structure
        if (Array.isArray(data)) {
          return { data, total: data.length, page: 1, limit: 10, totalPages: 1 };
        }
        
        return {
          data: data.data || [],
          total: data.total || 0,
          page: data.page || 1,
          limit: data.limit || 10,
          totalPages: data.totalPages || 0,
        };
      } catch (error: any) {
        const isServer = typeof window === 'undefined';
        if (error.name === 'AbortError') {
          if (isServer || process.env.NODE_ENV !== 'production') {
            console.warn('[API] Articles: Request timeout');
          }
        } else {
          const errorMsg = error.message || String(error);
          if (isServer || process.env.NODE_ENV !== 'production') {
            console.error('[API] Articles: Error fetching articles:', errorMsg);
          }
        }
        return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      }
    },
    getBySlug: async (slug: string) => {
      try {
        const response = await fetch(`${getAPIURL()}/api/articles/slug/${slug}`);
        const data = await response.json();
        
        if (data.statusCode && data.statusCode >= 400) {
          throw new Error(data.message || 'مقاله یافت نشد');
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return data;
      } catch (error) {
        console.error('Error fetching article:', error);
        throw error;
      }
    },
  },
  news: {
    getAll: async (params?: { published?: boolean; page?: number; limit?: number }) => {
      try {
        const searchParams = new URLSearchParams();
        if (params?.published !== undefined)
          searchParams.append('published', params.published.toString());
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const apiUrl = getAPIURL();
        const url = `${apiUrl}/api/news?${searchParams}`;
        
        // For server-side rendering, use Next.js fetch with cache
        const isServer = typeof window === 'undefined';
        
        // Log API URL in development or when debugging
        if (isServer && (process.env.NODE_ENV !== 'production' || process.env.DEBUG_API === 'true')) {
          console.log('[API] News: Fetching from URL:', url);
        }
        
        const fetchOptions: RequestInit = {
          headers: {
            'Content-Type': 'application/json',
          },
          // Next.js cache options for server-side
          ...(isServer && {
            cache: 'no-store', // Always fetch fresh data on server
            next: { revalidate: 60 }, // Revalidate every 60 seconds
          }),
        };
        
        // Add timeout only for client-side (setTimeout doesn't work well in server-side)
        let controller: AbortController | undefined;
        let timeoutId: NodeJS.Timeout | undefined;
        
        if (!isServer) {
          controller = new AbortController();
          timeoutId = setTimeout(() => controller!.abort(), 15000);
          fetchOptions.signal = controller.signal;
        }
        
        const response = await fetch(url, fetchOptions);
        
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        // Check if response is ok
        if (!response.ok) {
          const errorMsg = `HTTP Error ${response.status}: ${response.statusText} for ${url}`;
          if (isServer || process.env.NODE_ENV !== 'production') {
            console.error('[API] News:', errorMsg);
          }
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
          }
          return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
        }
        
        // Parse JSON response
        let data;
        try {
          data = await response.json();
        } catch (error) {
          const errorMsg = 'Error parsing JSON response';
          if (isServer || process.env.NODE_ENV !== 'production') {
            console.error('[API] News:', errorMsg, error);
          }
          return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
        }
        
        // Check if response is an error object
        if (data.statusCode && data.statusCode >= 400) {
          const errorMsg = data.message || 'خطا در دریافت اخبار';
          if (isServer || process.env.NODE_ENV !== 'production') {
            console.error('[API] News:', errorMsg);
          }
          return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
        }
        
        // Return data with proper structure
        if (Array.isArray(data)) {
          return { data, total: data.length, page: 1, limit: 10, totalPages: 1 };
        }
        
        return {
          data: data.data || [],
          total: data.total || 0,
          page: data.page || 1,
          limit: data.limit || 10,
          totalPages: data.totalPages || 0,
        };
      } catch (error: any) {
        const isServer = typeof window === 'undefined';
        if (error.name === 'AbortError') {
          if (isServer || process.env.NODE_ENV !== 'production') {
            console.warn('[API] News: Request timeout');
          }
        } else {
          const errorMsg = error.message || String(error);
          if (isServer || process.env.NODE_ENV !== 'production') {
            console.error('[API] News: Error fetching news:', errorMsg);
          }
        }
        return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      }
    },
    getBySlug: async (slug: string) => {
      try {
        const response = await fetch(`${getAPIURL()}/api/news/slug/${slug}`);
        const data = await response.json();
        
        if (data.statusCode && data.statusCode >= 400) {
          throw new Error(data.message || 'خبر یافت نشد');
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return data;
      } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
      }
    },
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
