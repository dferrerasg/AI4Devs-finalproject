<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
});

const authStore = useAuthStore();
const { logout } = useAuth();
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <p>Welcome, {{ authStore.user?.fullName }}!</p>
    
    <div class="mt-4">
      <UiButton @click="logout" variant="outline">Sign out</UiButton>
    </div>
  </div>
</template>
