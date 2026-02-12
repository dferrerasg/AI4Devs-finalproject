<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div class="p-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-primary">Trace</h1>
      </div>
      
      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink 
          to="/dashboard" 
          class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          active-class="bg-blue-50 text-primary font-medium"
        >
          <span class="mr-3">📂</span>
          Proyectos
        </NuxtLink>
        <!-- Add more links here if needed -->
      </nav>

      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center mb-4 px-4" v-if="authStore.user">
           <div class="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
              {{ authStore.user.fullName?.charAt(0) || 'U' }}
           </div>
           <div class="ml-3">
              <p class="text-sm font-medium text-gray-700 truncate max-w-[120px]">{{ authStore.user.fullName }}</p>
              <p class="text-xs text-gray-500 truncate max-w-[120px]">{{ authStore.user.role }}</p>
           </div>
        </div>
        <button 
          @click="handleLogout"
          class="w-full flex items-center px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <span class="mr-3">🚪</span>
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Mobile Header -->
        <header class="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
             <h1 class="text-xl font-bold text-primary">Trace</h1>
             <button @click="toggleMenu" class="text-gray-500">
                 Menu
             </button>
        </header>

        <main class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <slot />
        </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.clearAuth();
  router.push('/login'); // Use router.push directly or navigateTo
};

const toggleMenu = () => {
    // Basic mobile menu toggle logic could go here
    alert('Mobile menu not implemented in MVP'); 
};
</script>
