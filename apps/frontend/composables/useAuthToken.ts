import { useAuthStore } from '~/stores/auth';
import { useGuestStore } from '~/stores/guest';

/**
 * Composable para obtener el token de autenticación
 * Ya sea de un usuario normal o de un guest
 */
export const useAuthToken = () => {
  const authStore = useAuthStore();
  const guestStore = useGuestStore();

  // Intentar obtener token inyectado (para guests en páginas públicas)
  const injectedToken = inject<Ref<string>>('guestAuthToken', ref(''));

  const token = computed(() => {
    // Prioridad: authStore > injectedToken > guestStore
    if (authStore.token) {
      return authStore.token;
    }
    if (injectedToken.value) {
      return injectedToken.value;
    }
    return guestStore.guestToken.value || '';
  });

  return {
    token,
  };
};
