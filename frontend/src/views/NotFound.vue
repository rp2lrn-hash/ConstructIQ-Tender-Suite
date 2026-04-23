<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6">
        <i class="pi pi-exclamation-triangle text-5xl text-primary-600 dark:text-primary-400"></i>
      </div>
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">Page not found</p>
      <router-link to="/">
        <Button label="Go to Dashboard" icon="pi pi-home" />
      </router-link>
    </div>
  </div>
</template>
