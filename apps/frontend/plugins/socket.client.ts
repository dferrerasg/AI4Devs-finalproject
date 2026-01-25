import { io } from "socket.io-client";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  
  // Inicializar socket solo en el cliente
  if (import.meta.client) {
    const socket = io(config.public.socketUrl, {
        autoConnect: false, // Control manual de conexión
    });

    return {
        provide: {
        socket: socket,
        },
    };
  }
});
