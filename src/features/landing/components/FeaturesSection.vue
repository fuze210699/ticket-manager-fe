<template>
  <section id="features" class="w-full py-12 lg:py-24 xl:py-32 bg-muted scroll-mt-16">
    <div class="container px-4 mx-auto">
      <div class="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div class="space-y-2">
          <div
            class="relative inline-block text-lg font-bold text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-primary after:to-secondary"
          >
            Features
          </div>
          <h2 class="text-3xl font-bold tracking-tighter lg:text-5xl">
            Build Your Perfect Workspace
          </h2>
          <p class="max-w-[900px] text-muted-foreground lg:text-xl">
            Discover a collection of powerful widgets and tools to create your ideal workspace
            environment.
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
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-bold">Customizable Widgets</h3>
          <p class="text-sm text-muted-foreground">
            Choose from a variety of pre-built widgets and arrange them exactly how you want in your
            workspace.
          </p>
        </div>
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
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <h3 class="text-lg font-bold">Flexible Layout</h3>
          <p class="text-sm text-muted-foreground">
            Drag, drop, and resize widgets to create the perfect layout for your workflow.
          </p>
        </div>
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
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold">Powerful Tools</h3>
          <p class="text-sm text-muted-foreground">
            Access a suite of powerful tools and integrations to enhance your productivity.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// No logic needed for this component
</script>
