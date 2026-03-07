<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo y Nombre del Proyecto -->
        <div class="flex items-center space-x-4">
          <img src="~/assets/images/logo-trace.png" alt="Trace" class="h-8 w-auto" />
          <div class="flex items-center space-x-2">
            <h1 class="text-lg font-semibold text-gray-900">{{ projectName }}</h1>
            <span class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              Modo Invitado
            </span>
          </div>
        </div>

        <!-- Info del Invitado -->
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span class="text-sm font-medium text-gray-600">
                {{ guestInitials }}
              </span>
            </div>
            <span class="text-sm text-gray-700">{{ guestName }}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  projectName: string;
  guestName: string;
}>();

const guestInitials = computed(() => {
  const names = props.guestName.split(' ');
  if (names.length >= 2) {
    return names[0][0].toUpperCase() + names[1][0].toUpperCase();
  }
  return props.guestName.substring(0, 2).toUpperCase();
});
</script>
