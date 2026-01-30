<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useProjectStore } from '~/stores/project';
import ProjectCard from '~/components/projects/ProjectCard.vue';
import CreateProjectModal from '~/components/projects/CreateProjectModal.vue';

definePageMeta({
  middleware: ['auth']
});

const authStore = useAuthStore();
const projectStore = useProjectStore();
const { logout } = useAuth();

const showCreateModal = ref(false);

onMounted(() => {
  projectStore.fetchProjects();
});

const handleCreateClick = () => {
  if (projectStore.canCreateProject) {
    showCreateModal.value = true;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-sm text-gray-500">Bienvenido, {{ authStore.user?.fullName }}</p>
        </div>
        <div class="flex items-center gap-4">
          <button 
            @click="logout" 
            class="text-sm text-gray-600 hover:text-gray-900"
          >
            Cerrar Sesión
          </button>
          
          <button
            @click="handleCreateClick"
            :disabled="!projectStore.canCreateProject"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            :title="!projectStore.canCreateProject ? 'Has alcanzado el límite de proyectos de tu plan' : ''"
          >
            <!-- Plus Icon -->
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Nuevo Proyecto
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Loading State -->
      <div v-if="projectStore.loading && projectStore.projects.length === 0" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="projectStore.error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <!-- Alert Icon -->
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">
              {{ projectStore.error }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!projectStore.loading && projectStore.projects.length === 0 && !projectStore.error" class="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No hay proyectos</h3>
        <p class="mt-1 text-sm text-gray-500">Comienza creando tu primer proyecto de arquitectura.</p>
        <div class="mt-6">
          <button
            @click="handleCreateClick"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Crear Proyecto
          </button>
        </div>
      </div>

      <!-- Project Grid -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectCard 
          v-for="project in projectStore.projects" 
          :key="project.id" 
          :project="project" 
        />
      </div>
    </main>

    <CreateProjectModal 
      v-model="showCreateModal" 
      @success="projectStore.fetchProjects"
    />
  </div>
</template>
