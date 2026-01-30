<script setup lang="ts">
import type { Project } from '~/types/project';

const props = defineProps<{
  project: Project
}>();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

<template>
  <div class="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col h-full">
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-lg font-semibold text-gray-800 truncate" :title="project.title">
        {{ project.title }}
      </h3>
      <span 
        class="text-xs px-2 py-1 rounded-full font-medium"
        :class="project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
      >
        {{ project.status }}
      </span>
    </div>
    
    <p class="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
      {{ project.description || 'Sin descripción' }}
    </p>
    
    <div class="mt-auto flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
      <span>Actualizado: {{ formatDate(project.updatedAt) }}</span>
      <button class="text-indigo-600 hover:text-indigo-800 font-medium">
        Ver Proyecto &rarr;
      </button>
    </div>
  </div>
</template>
