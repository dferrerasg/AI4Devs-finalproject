# Plan de Estrategia de Testing Frontend (Unit & E2E)

Este documento detalla el plan para asegurar la calidad del código frontend mediante pruebas unitarias (Vitest) y de extremo a extremo (Playwright), cubriendo los componentes y flujos críticos implementados en FRONT-001.

## 1. Configuración de Entorno

- [ ] **Validar Configuración Vitest**: Asegurar que `vitest.config.ts` incluye alias de Nuxt y entorno `happy-dom`.
- [ ] **Validar Configuración Playwright**: Verificar `playwright.config.ts` apuntando al `baseURL` correcto y configurando el `webServer` para levantar la app antes de los tests.

## 2. Pruebas Unitarias (Vitest)

El objetivo es probar componentes aislados y lógica de negocio pura.

### 2.1. Componentes Base (UI Kit)
- **`components/common/UiInput.spec.ts`**
    - [ ] Renderiza correctamente con props (`label`, `placeholder`).
    - [ ] Emite eventos `update:modelValue`.
    - [ ] Muestra mensajes de error cuando la prop `errorMessage` está presente.
    - [ ] Aplica clases de error visualmente.

- **`components/common/UiButton.spec.ts`**
    - [ ] Renderiza el slot por defecto.
    - [ ] Muestra el spinner cuando `loading` es true y deshabilita el botón.
    - [ ] Aplica las clases correctas según la variante (`primary`, `secondary`, etc.).
    - [ ] Emite evento `click` cuando no está deshabilitado.

### 2.2. Stores (Pinia)
- **`stores/auth.spec.ts`**
    - [ ] `setUser` actualiza el estado del usuario.
    - [ ] `setToken` actualiza el token y la cookie.
    - [ ] `isAuthenticated` devuelve `true` solo si hay token.
    - [ ] `clearAuth` resetea usuario y token a null.

### 2.3. Composables (Lógica de Negocio)
- **`tests/unit/composables/useAuth.spec.ts`**
    - [ ] **Mocking**: Se debe mockear `$fetch` y `navigateTo`.
    - [ ] `login`: Llama al endpoint correcto y actualiza el store.
    - [ ] `register`: Llama al endpoint de registro y luego realiza auto-login.
    - [ ] `logout`: Limpia el store y redirige a login.
    - [ ] Manejo de errores: Verifica que las variables reactivas `error` y `loading` cambien correctamente.

## 3. Pruebas End-to-End (Playwright)

El objetivo es probar los flujos completos de usuario en un navegador real.

### 3.1. Flujos de Autenticación
- **`tests/e2e/auth.spec.ts`**
    - [ ] **Registro Exitoso**:
        1. Ir a `/register`.
        2. Rellenar formulario válido.
        3. Click "Create account".
        4. Verificar redirección a `/dashboard`.
        5. Verificar bienvenida con nombre de usuario.
    - [ ] **Login Exitoso**:
        1. Ir a `/login`.
        2. Rellenar credenciales válidas.
        3. Click "Sign in".
        4. Verificar redirección a `/dashboard`.
    - [ ] **Validación de Formularios**:
        1. Intentar enviar formularios vacíos.
        2. Verificar mensajes de error de `vee-validate` en pantalla.
        3. Verificar error de "Passwords don't match" en registro.

### 3.2. Protección de Rutas (Middleware)
- **`tests/e2e/middleware.spec.ts`**
    - [ ] **Protección Dashboard**: Intentar acceder a `/dashboard` sin loguearse -> Redirección a `/login`.
    - [ ] **Protección Guest**: Estando logueado, intentar acceder a `/login` -> Redirección a `/dashboard`.

## 4. Ejecución

```bash
# Ejecutar Unit Tests
npm run test:unit

# Ejecutar E2E Tests (con UI para debug)
npm run test:e2e -- --ui
```
