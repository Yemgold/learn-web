




// src/lib/api/client.ts

import type {
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

import { axiosInstance } from "./axios";

export const apiClient = {
  get: async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> =
      await axiosInstance.get(url, config);

    return response.data;
  },

  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> =
      await axiosInstance.post(url, data, config);

    return response.data;
  },

  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> =
      await axiosInstance.put(url, data, config);

    return response.data;
  },

  patch: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> =
      await axiosInstance.patch(url, data, config);

    return response.data;
  },

  delete: async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> =
      await axiosInstance.delete(url, config);

    return response.data;
  },
};