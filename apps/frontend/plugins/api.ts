import { defineNuxtPlugin } from '#app';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ request, options }) {
      const token = authStore.token;
      
      if (token) {
        const authHeaderValue = `Bearer ${token}`;
        
        options.headers = options.headers || {};
        
        // Handle both plain object and Headers instance cases
        if (options.headers instanceof Headers) {
            options.headers.set('Authorization', authHeaderValue);
        } else if (Array.isArray(options.headers)) {
            // Handle array of headers formatting
            options.headers.push(['Authorization', authHeaderValue]);
        } else {
            // Plain object
            // @ts-ignore
            options.headers.Authorization = authHeaderValue;
        }
      } else {
        console.warn('API Request without token (Store empty):', request);
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        authStore.clearAuth();
        navigateTo('/login');
      }
    }
  });

  return {
    provide: {
      api
    }
  };
});
