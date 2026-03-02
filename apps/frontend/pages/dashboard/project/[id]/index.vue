<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Detalle del Proyecto</h1>
      <p class="mt-1 text-sm text-gray-500">ID: {{ projectId }}</p>
    </div>

    <!-- Pestañas de Navegación del Proyecto (Planos, Miembros, Config) -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <a href="#" class="border-primary text-primary whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium" aria-current="page">Planos</a>
        <a href="#" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">Miembros</a>
        <a href="#" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">Configuración</a>
      </nav>
    </div>

    <!-- Contenido Principal: Lista de Planos -->
    <PlanList :project-id="projectId" />
  </div>
</template>

<script setup lang="ts">
import PlanList from '@/components/plans/PlanList.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const route = useRoute()
const projectId = computed(() => route.params.id as string)

</script>
