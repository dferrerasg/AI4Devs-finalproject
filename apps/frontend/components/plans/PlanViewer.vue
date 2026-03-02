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
          <div class="text-xs text-gray-500 font-mono">
             Zoom: {{ Math.round(scale * 100) }}%
          </div>
       </div>

       <!-- Canvas Container -->
       <div 
         ref="containerRef"
         class="flex-1 overflow-hidden p-0 relative flex items-center justify-center bg-gray-50 bg-dots z-0 select-none cursor-grab"
         :class="{ 'cursor-grabbing': isDragging }"
         @wheel.prevent="onWheel"
         @pointerdown="onPointerDown"
         @pointermove="onPointerMove"
         @pointerup="onPointerUp"
         @pointercancel="onPointerUp"
       >
          <div v-if="loading" class="text-gray-500 animate-pulse">Cargando plano...</div>
          <div v-else-if="error" class="text-red-500 bg-red-50 p-4 rounded border border-red-200">
             Error: {{ error }}
          </div>
          <div v-else-if="!hasLayers" class="text-center text-gray-400">
             <p class="mb-2">El plano está vacío.</p>
             <button @click="showUploadModal = true" class="text-primary hover:underline">Sube una capa base</button>
          </div>
          <div v-else>
             <!-- Transform Layer -->
             <div 
               class="plan-content origin-top-left will-change-transform absolute top-0 left-0"
               :style="transformStyle"
             >
                <!-- Renderizado de capas superpuestas -->
                <div class="relative w-full h-full"> 
                  <template v-for="layer in currentPlan?.layers?.filter(l => l.status === 'READY')" :key="layer.id">
                    <img 
                      :src="getImageUrl(layer.imageUrl)" 
                      class="max-w-none pointer-events-none absolute top-0 left-0" 
                      draggable="false"
                      @load="onImageLoad" 
                    />
                  </template>
                </div>
             </div>

             <!-- Controls Overlay -->
             <div class="absolute bottom-6 right-6 z-10 transition-opacity duration-300 hover:opacity-100 opacity-90">
               <PlanControls 
                 :zoom-level="scale"
                 @zoom-in="handleZoomIn"
                 @zoom-out="handleZoomOut" 
                 @reset="reset"
                 @fit="handleFit"
               />
             </div>
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
import PlanControls from '@/components/plans/PlanControls.vue'

const props = defineProps<{
    planId: string
    projectId?: string
}>()

const { setCurrentPlan, currentPlan, loading, error } = usePlans()
const showUploadModal = ref(false)
const config = useRuntimeConfig()

// --- Navigation Logic (US-004) ---
const containerRef = ref<HTMLElement | null>(null)
// We track the first image to determine base dimensions for "Fit to Screen"
const baseImageRef = ref<HTMLImageElement | null>(null)

const { 
  scale, 
  transformStyle, 
  isDragging,
  zoomToPoint, 
  startDrag, 
  onDrag, 
  stopDrag, 
  reset,
  fitToScreen
} = usePlanNavigation()

const onWheel = (e: WheelEvent) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const point = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  const delta = Math.sign(e.deltaY) 
  zoomToPoint(delta, point)
}

const onPointerDown = (e: PointerEvent) => {
  if (!containerRef.value) return
  (e.target as Element).setPointerCapture(e.pointerId)
  startDrag({ x: e.clientX, y: e.clientY })
}

const onPointerMove = (e: PointerEvent) => onDrag({ x: e.clientX, y: e.clientY })

const onPointerUp = (e: PointerEvent) => {
  if (e.target) (e.target as Element).releasePointerCapture(e.pointerId)
  stopDrag()
}

const getCenterPoint = () => {
  if (!containerRef.value) return { x: 0, y: 0 }
  const rect = containerRef.value.getBoundingClientRect()
  return { x: rect.width / 2, y: rect.height / 2 }
}

const handleZoomIn = () => zoomToPoint(-1, getCenterPoint())
const handleZoomOut = () => zoomToPoint(1, getCenterPoint())

const handleFit = () => {
    // If we have a base image reference, use it
    if (!containerRef.value || !baseImageRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    const img = baseImageRef.value
    
    // Fit only if we have dimensions
    if (img.naturalWidth && img.naturalHeight) {
       // Call composable logic
       scale.value = Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight) * 0.9
       position.value.x = (rect.width - img.naturalWidth * scale.value) / 2
       position.value.y = (rect.height - img.naturalHeight * scale.value) / 2
    }
}

const onImageLoad = (e: Event) => {
    const img = e.target as HTMLImageElement
    // If it's the first image loading and view is default, set as base and fit
    if (!baseImageRef.value) {
        baseImageRef.value = img
        // Wait next tick for layout to stabilize if needed, but direct calc works
        handleFit()
    }
}

// Keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return
  const center = getCenterPoint()
  switch(e.key) {
    case '+': case '=': zoomToPoint(-1, center); break
    case '-': zoomToPoint(1, center); break
    case '0': case 'r': case 'R': reset(); break
  }
}

const hasLayers = computed(() => {
    return currentPlan.value?.layers && currentPlan.value.layers.length > 0
})

const getImageUrl = (path?: string) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    const configuredUrl = config.public.socketUrl || 'http://localhost:4000'
    const baseUrl = configuredUrl.replace(/\/$/, '')
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl}${cleanPath}`
}

onMounted(() => {
    setCurrentPlan(props.planId, props.projectId)
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
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
