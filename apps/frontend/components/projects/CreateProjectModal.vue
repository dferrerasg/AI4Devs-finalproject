<script setup lang="ts">
import { ref } from 'vue';
import { useProjectStore } from '~/stores/project';

const props = defineProps<{
  modelValue: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const projectStore = useProjectStore();
const form = ref({
  title: '',
  description: ''
});
const isSubmitting = ref(false);
const errorMessage = ref('');

const closeModal = () => {
  emit('update:modelValue', false);
  form.value = { title: '', description: '' };
  errorMessage.value = '';
};

const handleSubmit = async () => {
  if (!form.value.title.trim()) {
    errorMessage.value = 'El título es obligatorio';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    await projectStore.createProject({
      title: form.value.title,
      description: form.value.description
    });
    emit('success');
    closeModal();
  } catch (e: any) {
    errorMessage.value = e.message || 'Error al crear proyecto';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
        <h3 class="text-lg font-medium text-gray-900">Nuevo Proyecto</h3>
        <button 
          @click="closeModal" 
          class="text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div v-if="errorMessage" class="bg-red-50 text-red-700 p-3 rounded text-sm">
          {{ errorMessage }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input 
            v-model="form.title" 
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Mi nuevo proyecto"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea 
            v-model="form.description" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows="3"
            placeholder="Descripción opcional..."
          ></textarea>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button 
            type="button" 
            @click="closeModal" 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Creando...' : 'Crear Proyecto' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
