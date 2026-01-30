<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: 'auth',
  middleware: ['guest']
});

const { register, loading, error } = useAuth();

const validationSchema = toTypedSchema(
  z.object({
    fullName: z.string().min(2, 'Name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
);

const { handleSubmit } = useForm({
  validationSchema,
});

const onSubmit = handleSubmit(async (values) => {
  await register({
    fullName: values.fullName,
    email: values.email,
    password: values.password,
    confirmPassword: values.confirmPassword
  });
});
</script>

<template>
  <div>
    <NuxtLayout name="auth">
      <template #title>Create your account</template>
      <template #subtitle>
        Already have an account?
        <NuxtLink to="/login" class="font-medium text-primary hover:text-blue-500">
          Sign in
        </NuxtLink>
      </template>

      <form class="space-y-6" @submit="onSubmit">
        <!-- Global Error Alert -->
        <div v-if="error" class="p-4 rounded-md bg-red-50 border border-red-200">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
            </div>
          </div>
        </div>

        <UiInput
          name="fullName"
          label="Full Name"
          type="text"
          placeholder="Ark. Wright"
        />

        <UiInput
          name="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
        />

        <UiInput
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
        />

        <UiInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
        />

        <div>
          <UiButton type="submit" class="w-full" :loading="loading">
            Create account
          </UiButton>
        </div>
      </form>
    </NuxtLayout>
  </div>
</template>
