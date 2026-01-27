<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <!-- Using the logo from assets -->
        <img class="h-12 w-auto" src="~/assets/images/logo-trace.png" alt="TRACÉ" />
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-text">
        <slot name="title">Welcome back</slot>
      </h2>
      <p class="mt-2 text-center text-sm text-secondary">
        <slot name="subtitle"></slot>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
        <slot /> <!-- Main content (Login/Register forms) -->
      </div>
    </div>
  </div>
</template>
