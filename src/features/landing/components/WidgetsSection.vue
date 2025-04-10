<template>
  <section id="widgets" class="w-full py-12 lg:py-24 xl:py-32 scroll-mt-16">
    <div class="container px-4 mx-auto">
      <div class="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div class="space-y-2">
          <div
            class="relative inline-block text-lg font-bold text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-primary after:to-secondary"
          >
            {{ $t('landing.widgets.title') }}
          </div>
          <h2 class="text-3xl font-bold tracking-tighter lg:text-5xl">{{ $t('landing.widgets.subtitle') }}</h2>
          <p class="max-w-[900px] text-muted-foreground lg:text-xl">
            {{ $t('landing.widgets.description') }}
          </p>
        </div>
      </div>
      <div class="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div
          class="grid gap-4 p-6 rounded-lg border bg-card text-card-foreground shadow-sm h-64 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/50"
        >
          <div class="text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-bold">{{ $t('landing.widgets.analytics.title') }}</h3>
          <p class="text-sm text-muted-foreground">
            {{ $t('landing.widgets.analytics.description') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// No logic needed for this component
</script>
