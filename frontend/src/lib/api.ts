/**
 * Centralized API Configuration
 * 
 * This file provides a single source of truth for API endpoints
 * and configuration. Update the .env file to change the API URL.
 */

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Get authentication headers for API requests
 */
export const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access_token") ?? ""}`,
});

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("access_token");
  return !!token;
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const stored = localStorage.getItem("user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

/**
 * Clear authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};

/**
 * API client with automatic error handling
 */
export const apiClient = {
  async get(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        clearAuth();
        window.location.href = "/";
      }
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  },

  async post(endpoint: string, data?: any, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        clearAuth();
        window.location.href = "/";
      }
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  },

  async patch(endpoint: string, data?: any, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        clearAuth();
        window.location.href = "/";
      }
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  },

  async delete(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        clearAuth();
        window.location.href = "/";
      }
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  },
};
