<script setup lang="ts">
import { useField } from 'vee-validate';

const props = defineProps<{
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  modelValue?: string;
}>();

const { value, errorMessage } = useField(() => props.name, undefined, {
  syncVModel: true,
});
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="name" class="text-sm font-medium text-text">
      {{ label }}
    </label>
    <input
      :id="name"
      v-model="value"
      :type="type || 'text'"
      :placeholder="placeholder"
      :class="[
        'px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
        errorMessage 
          ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500' 
          : 'border-slate-200 text-text placeholder-slate-400'
      ]"
    />
    <span v-if="errorMessage" class="text-xs text-red-500 mt-0.5">
      {{ errorMessage }}
    </span>
  </div>
</template>
