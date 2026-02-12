<template>
  <div class="w-72 bg-white border-r border-gray-200 h-full flex flex-col">
    <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
      <h3 class="font-semibold text-gray-700">Capas</h3>
      
      <button 
        @click="$emit('add-layer')" 
        class="text-primary hover:text-primary-dark p-1 rounded hover:bg-white transition"
        title="Añadir Capa"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-2 space-y-4">
      <!-- Base Layers -->
      <div>
        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Base</h4>
        <ul class="space-y-1">
          <li v-for="layer in baseLayers" :key="layer.id" class="flex items-center p-2 rounded hover:bg-gray-50 group">
             <!-- Status Icon -->
             <span class="mr-2" :title="layer.status">
                <span v-if="layer.status === 'PROCESSING'" class="block h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
                <span v-else-if="layer.status === 'READY'" class="block h-2 w-2 rounded-full bg-green-500"></span>
                <span v-else class="block h-2 w-2 rounded-full bg-red-500"></span>
             </span>
             <span class="text-sm text-gray-700 truncate flex-1">{{ layer.name }}</span>
          </li>
          <li v-if="baseLayers.length === 0" class="text-xs text-gray-400 px-2 italic">Sin capa base</li>
        </ul>
      </div>

      <!-- Overlays -->
      <div>
        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Overlays</h4>
        <ul class="space-y-1">
           <li v-for="layer in overlayLayers" :key="layer.id" class="flex items-center p-2 rounded hover:bg-gray-50">
             <!-- Status Icon -->
             <span class="mr-2" :title="layer.status">
                <span v-if="layer.status === 'PROCESSING'" class="block h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
                <span v-else-if="layer.status === 'READY'" class="block h-2 w-2 rounded-full bg-green-500"></span>
                <span v-else class="block h-2 w-2 rounded-full bg-red-500"></span>
             </span>
             <span class="text-sm text-gray-700 truncate flex-1">{{ layer.name }}</span>
          </li>
          <li v-if="overlayLayers.length === 0" class="text-xs text-gray-400 px-2 italic">Sin overlays</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Layer } from '~/types/plan'

const props = defineProps<{
  layers: Layer[]
}>()

const baseLayers = computed(() => props.layers.filter(l => l.type === 'BASE'))
const overlayLayers = computed(() => props.layers.filter(l => l.type === 'OVERLAY'))

defineEmits(['add-layer'])
</script>
