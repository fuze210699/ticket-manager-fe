<template>
  <section class="w-full py-12 lg:py-24 xl:py-32 border-b">
    <div class="container px-4 mx-auto">
      <div class="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
        <div class="flex flex-col justify-center space-y-4">
          <div class="space-y-2">
            <h1
              class="text-3xl font-bold tracking-tighter lg:text-5xl xl:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            >
              Your Personal Workspace, Your Way
            </h1>
            <p class="max-w-[600px] text-muted-foreground lg:text-xl">
              Create your perfect digital workspace with customizable widgets and tools. Build,
              organize, and optimize your workflow exactly how you want it.
            </p>
          </div>
          <div class="flex flex-col gap-2 lg:flex-row">
            <Button size="lg" variant="primary" @click="$emit('navigate', '/signup')">
              Start Building
            </Button>
            <Button size="lg" variant="outline" @click="$emit('scroll', 'templates')">
              Explore Templates
            </Button>
          </div>
        </div>
        <img
          src="https://placehold.co/600x400/e2e8f0/64748b?text=App+Screenshot"
          alt="Hero Image Placeholder"
          width="600"
          height="400"
          class="mx-auto aspect-video overflow-hidden rounded-xl object-cover lg:w-full lg:order-last lg:aspect-square"
          @error="handleImageError"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import Button from '@core/ui/Button.vue';

defineEmits(['navigate', 'scroll']);

const handleImageError = event => {
  event.target.src = 'https://placehold.co/600x400/e0e0e0/a0a0a0?text=Image+Not+Found';
};
</script>
