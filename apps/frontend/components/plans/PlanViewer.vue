<template>
  <div class="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-100"> 
    <!-- Sidebar -->
    <LayerSidebar 
      :layers="currentPlan?.layers || []" 
      @add-layer="showUploadModal = true"
    />

    <!-- Main Stage Area -->
    <div class="flex-1 relative flex flex-col">
       <!-- Toolbar (Placeholder) -->
       <div class="h-12 bg-white border-b border-gray-200 flex items-center px-4 shadow-sm z-10">
          <h2 class="text-sm font-semibold text-gray-800 mr-4">
             {{ currentPlan?.sheetName }} <span class="text-gray-400 font-normal">v{{ currentPlan?.version }}</span>
          </h2>
          <div class="flex-1"></div>
          <div class="text-xs text-gray-500">
             Zoom: 100%
          </div>
       </div>

       <!-- Canvas Container -->
       <div class="flex-1 overflow-auto p-8 relative flex items-center justify-center bg-dots">
          <div v-if="loading" class="text-gray-500 animate-pulse">Cargando plano...</div>
          <div v-else-if="error" class="text-red-500 bg-red-50 p-4 rounded border border-red-200">
             Error: {{ error }}
          </div>
          <div v-else-if="!hasLayers" class="text-center text-gray-400">
             <p class="mb-2">El plano está vacío.</p>
             <button @click="showUploadModal = true" class="text-primary hover:underline">Sube una capa base</button>
          </div>
          <div v-else class="w-[800px] h-[600px] bg-white shadow-lg relative border border-gray-300">
             <!-- Placeholder para el Canvas Real -->
             <div class="absolute inset-0 flex items-center justify-center text-gray-300 select-none pointer-events-none">
                AREA DEL VISOR (US-004)
             </div>
             <!-- Renderizado simple de capas para feedback visual inmediato -->
             <img 
                v-for="layer in currentPlan?.layers?.filter(l => l.status === 'READY')" 
                :key="layer.id"
                :src="layer.imageUrl"
                class="absolute inset-0 w-full h-full object-contain"
                :class="{'opacity-50': layer.type === 'OVERLAY'}"
             />
          </div>
       </div>
    </div>

    <!-- Modals -->
    <LayerUploadModal 
       v-if="currentPlan"
       v-model="showUploadModal" 
       :plan-id="currentPlan.id"
       @success="onUploadSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import LayerSidebar from '@/components/layers/LayerSidebar.vue'
import LayerUploadModal from '@/components/layers/LayerUploadModal.vue'

const props = defineProps<{
    planId: string
    projectId?: string
}>()

const { setCurrentPlan, currentPlan, loading, error } = usePlans()
const showUploadModal = ref(false)

const hasLayers = computed(() => {
    return currentPlan.value?.layers && currentPlan.value.layers.length > 0
})

onMounted(() => {
    setCurrentPlan(props.planId, props.projectId)
})

const onUploadSuccess = () => {
    // El store ya se actualiza optimisticamente o via re-fetch, 
    // pero podemos forzar refresh si fuera necesario
}
</script>

<style scoped>
.bg-dots {
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
