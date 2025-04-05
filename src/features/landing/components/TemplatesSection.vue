<template>
  <section id="templates" class="w-full py-12 lg:py-24 xl:py-32 bg-muted scroll-mt-16">
    <div class="container px-4 mx-auto">
      <div class="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div class="space-y-2">
          <div
            class="relative inline-block text-lg font-bold text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-primary after:to-secondary"
          >
            Workspace Templates
          </div>
          <h2 class="text-3xl font-bold tracking-tighter lg:text-5xl">Start With a Template</h2>
          <p class="max-w-[900px] text-muted-foreground lg:text-xl">
            Get up and running quickly with our pre-built workspace templates designed for various
            use cases.
          </p>
        </div>
      </div>
      <div class="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div
          class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
        >
          <div class="aspect-video w-full overflow-hidden bg-muted">
            <img
              src="https://placehold.co/600x400/e2e8f0/64748b?text=Project+Management"
              alt="Project Management Template"
              class="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div class="p-6">
            <h3 class="text-lg font-bold">Project Management</h3>
            <p class="text-sm text-muted-foreground mt-2">
              Organize your projects with task lists, timelines, and team collaboration tools.
            </p>
            <div class="mt-4 flex justify-between items-center">
              <span class="text-sm text-muted-foreground">Popular</span>
              <Button variant="outline" size="sm" class="text-primary">Preview</Button>
            </div>
          </div>
        </div>
        <div
          class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
        >
          <div class="aspect-video w-full overflow-hidden bg-muted">
            <img
              src="https://placehold.co/600x400/e2e8f0/64748b?text=Personal+Dashboard"
              alt="Personal Dashboard Template"
              class="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div class="p-6">
            <h3 class="text-lg font-bold">Personal Dashboard</h3>
            <p class="text-sm text-muted-foreground mt-2">
              Track your goals, habits, and daily tasks in one unified personal workspace.
            </p>
            <div class="mt-4 flex justify-between items-center">
              <span class="text-sm text-muted-foreground">New</span>
              <Button variant="outline" size="sm" class="text-primary">Preview</Button>
            </div>
          </div>
        </div>
        <div
          class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
        >
          <div class="aspect-video w-full overflow-hidden bg-muted">
            <img
              src="https://placehold.co/600x400/e2e8f0/64748b?text=Team+Collaboration"
              alt="Team Collaboration Template"
              class="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div class="p-6">
            <h3 class="text-lg font-bold">Team Collaboration</h3>
            <p class="text-sm text-muted-foreground mt-2">
              Enhance team communication with shared boards, documents, and chat.
            </p>
            <div class="mt-4 flex justify-between items-center">
              <span class="text-sm text-muted-foreground">Featured</span>
              <Button variant="outline" size="sm" class="text-primary">Preview</Button>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-12 flex justify-center">
        <Button variant="outline" size="lg">View All Templates</Button>
      </div>
    </div>
  </section>
</template>

<script setup>
import Button from '@core/ui/Button.vue';
</script>
