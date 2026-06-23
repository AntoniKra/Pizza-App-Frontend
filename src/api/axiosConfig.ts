import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7115',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Definiujemy dedykowany interfejs, aby uniknąć @ts-ignore
interface CancelablePromise<T> extends Promise<T> {
  cancel?: () => void;
}

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = axios.CancelToken.source();
  
  // Jawne rzutowanie na nasz nowy interfejs
  const promise = axiosInstance({
    ...config,
    cancelToken: source.token,
  }).then((response: AxiosResponse<T>) => response.data) as CancelablePromise<T>;

  // Bezpieczne przypisanie funkcji
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};