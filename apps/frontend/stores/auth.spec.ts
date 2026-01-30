import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './auth'
import { ref } from 'vue'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with null user and token', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.token).toBeFalsy()
    expect(store.isAuthenticated).toBe(false)
  })

  it('setUser updates user state', () => {
    const store = useAuthStore()
    const user = { id: '1', email: 'test@example.com', fullName: 'Test User' }
    store.setUser(user as any)
    expect(store.user).toEqual(user)
  })

  it('setToken updates token state', () => {
    const store = useAuthStore()
    store.setToken('test-token')
    expect(store.token).toBe('test-token')
    expect(store.isAuthenticated).toBe(true)
  })

  it('clearAuth resets state', () => {
    const store = useAuthStore()
    store.setUser({ id: '1' } as any)
    store.setToken('token')
    
    store.clearAuth()
    
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
