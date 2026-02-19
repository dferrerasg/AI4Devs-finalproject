# Plan de Implementación - BACK-005: Infraestructura de Eventos Real-time

Este plan detalla los pasos para desacoplar la lógica del Worker de la del Socket, utilizando Redis como bus de comunicación para notificar al usuario cuando su capa ha sido procesada.

## 📋 Fase 1: Datos y Contexto (Core & Shared)
El objetivo es que la "identidad" del usuario viaje junto con el trabajo de procesamiento a través de la cola.

1.  **Actualizar DTOs y Interfaces**:
    - [ ] Modificar `@trace/core/src/domain/jobs/layer-processing.job.ts`: Añadir `userId: string` a la interfaz `LayerProcessingJob`.
    - [ ] Modificar `apps/backend/src/domain/dtos/upload-layer.dto.ts`: Añadir `userId: string`.

2.  **Propagar UserId desde el Controller**:
    - [ ] En `LayerController`, extraer `req.user.id` (inyectado por el middleware de auth).
    - [ ] Pasarlo al llamar a `uploadLayerUseCase.execute(...)`.
    - [ ] Actualizar `UploadLayerUseCase` para incluir `userId` al añadir el job a la cola (`jobQueue.add`).

## 🛠️ Fase 2: Infraestructura WebSocket (Backend)
Crearemos un módulo centralizado para gestionar las conexiones y las salas privadas.

1.  **Crear `SocketService`**:
    - [ ] Ubicación: `apps/backend/src/infrastructure/websocket/socket.service.ts`.
    - [ ] Responsabilidad: Singleton que inicializa `io`, gestiona `on('connection')` y expone métodos como `notifyUser(userId, event, payload)`.
    - [ ] Lógica de Rooms: Al conectarse, el socket hace `socket.join("user:${userId}")`.

2.  **Middleware de Autenticación para Socket**:
    - [ ] Implementar validación de JWT en `socket.handshake.auth.token`.

3.  **Refactorizar `server.ts`**:
    - [ ] Eliminar la configuración inline actual de Socket.io.
    - [ ] Inicializar `SocketService` pasando la instancia `httpServer`.

## 🔄 Fase 3: Worker y Eventos (BullMQ)
El worker necesita devolver información útil, y el backend necesita escucharla.

1.  **Actualizar `LayerProcessor` (Worker)**:
    - [ ] Cambiar el método `process` para que retorne un objeto de resultado: `{ status: 'READY', layerId, planId, imageUrl }`. Esto será el `returnvalue` del job en Redis.

2.  **Implementar el "Redis Bridge" (Backend)**:
    - [ ] Crear `apps/backend/src/infrastructure/events/job-event.listener.ts`.
    - [ ] Instanciar `QueueEvents` de `bullmq` apuntando a la cola `layer-processing`.
    - [ ] Escuchar evento `completed`:
        - Leer `jobId`.
        - Obtener instancia del job (`Job.fromId`) para recuperar `job.data.userId`.
        - Emitir evento `layer:processed` vía `SocketService`.
    - [ ] Escuchar evento `failed`:
        - Emitir `layer:error` con la razón del fallo.
