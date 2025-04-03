<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-foreground mb-4">
        {{ $t('notFound.title') }}
      </h2>
      <p class="text-muted-foreground mb-8">
        {{ $t('notFound.description') }}
      </p>
      <router-link
        to="/"
        class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {{ $t('notFound.goHome') }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
// Không cần import useI18n vì $t đã được inject tự động
</script>
