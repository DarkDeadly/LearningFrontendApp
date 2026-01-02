// src/api/client.js
import axios from "axios";
import config from "../util/config";
import { storage } from "../util/storage";

// ========================================
// CREATE AXIOS INSTANCE
// ========================================
const apiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CRITICAL: Sends cookies (refresh token)
});

// ========================================
// REQUEST INTERCEPTOR
// ========================================
apiClient.interceptors.request.use(
  async (config) => {
    // Get access token from storage
    const token = await storage.getToken();
    
    // Add token to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log in development
    if (__DEV__) {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        headers: config.headers.Authorization ? '✅ Has Token' : '❌ No Token',
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========================================
// RESPONSE INTERCEPTOR WITH TOKEN REFRESH
// ========================================

// State variables for queue management
let isRefreshing = false;      // Are we currently refreshing?
let failedQueue = [];          // Queue of requests waiting for refresh

/**
 * Process all queued requests after refresh completes
 * @param {Error|null} error - Error if refresh failed
 * @param {string|null} token - New token if refresh succeeded
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  
  failedQueue = [];
};

apiClient.interceptors.response.use(
  // ========================================
  // SUCCESS HANDLER
  // ========================================
  (response) => {
    if (__DEV__) {
      console.log('📥 API Response:', {
        url: response.config.url,
        status: response.status,
      });
    }
    return response;
  },
  
  // ========================================
  // ERROR HANDLER
  // ========================================
  async (error) => {
    const originalRequest = error.config;

    // Log errors in development
    if (__DEV__) {
      console.log('❌ API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data?.message,
      });
    }

    // ========================================
    // CHECK IF WE SHOULD REFRESH TOKEN
    // ========================================
    
    // Don't refresh if:
    // 1. Error is not 401 (Unauthorized)
    // 2. We already tried to refresh this request
    // 3. The failing request IS the refresh endpoint itself
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/users/refresh')
    ) {
      return Promise.reject(error);
    }

    // ========================================
    // QUEUE MANAGEMENT
    // ========================================
    
    // If we're already refreshing, add this request to the queue
    if (isRefreshing) {
      console.log('⏳ Queuing request while refresh in progress...');
      
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          // When refresh completes, retry with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    // ========================================
    // START REFRESH PROCESS
    // ========================================
    
    console.log('🔄 Starting token refresh...');
    
    // Mark this request as retried
    originalRequest._retry = true;
    
    // Set flag to prevent concurrent refresh requests
    isRefreshing = true;

    try {
      // ========================================
      // CALL REFRESH ENDPOINT
      // ========================================
      
      console.log('📞 Calling refresh endpoint...');
      
      const response = await axios.post(
        `${config.apiUrl}/users/refresh`,
        {},
        { 
          withCredentials: true  // Send refresh token cookie
        }
      );

      const { accessToken } = response.data;
      
      console.log('✅ Got new access token');

      // ========================================
      // SAVE NEW TOKEN
      // ========================================
      
      await storage.saveToken(accessToken);
      console.log('💾 Saved new token to storage');

      // ========================================
      // UPDATE DEFAULT HEADER
      // ========================================
      
      // Update the default header for future requests
      apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      
      // Update the failed request's header
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      // ========================================
      // PROCESS QUEUED REQUESTS
      // ========================================
      
      console.log(`✅ Processing ${failedQueue.length} queued requests`);
      processQueue(null, accessToken);

      // ========================================
      // RETRY ORIGINAL REQUEST
      // ========================================
      
      console.log('🔁 Retrying original request...');
      return apiClient(originalRequest);

    } catch (refreshError) {
      // ========================================
      // REFRESH FAILED
      // ========================================
      
      console.error('❌ Token refresh failed:', refreshError);

      // Process queue with error
      processQueue(refreshError, null);

      // Clear stored data
      await storage.clearAll();
      console.log('🗑️ Cleared all stored data');

      // Optionally, redirect to login
      // Note: You'll need to handle navigation here
      // We'll add this in the next section

      return Promise.reject(refreshError);

    } finally {
      // ========================================
      // CLEANUP
      // ========================================
      
      isRefreshing = false;
    }
  }
);

export default apiClient;