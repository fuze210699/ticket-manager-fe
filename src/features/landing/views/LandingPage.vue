<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container flex h-14 max-w-screen-2xl items-center mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mr-4 hidden md:flex">
          <a class="mr-6 flex items-center space-x-2" href="/" @click.prevent="goToHome">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="h-6 w-6">
              <rect width="256" height="256" fill="none"></rect>
              <line x1="208" y1="128" x2="128" y2="208" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line>
              <line x1="192" y1="40" x2="40" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line>
            </svg>
            <span class="hidden font-bold sm:inline-block">Ticket Manager</span>
          </a>
        </div>
        <nav class="flex flex-1 items-center justify-end space-x-4">
          <router-link
            to="/login"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            @click="handleLoginClick"
          >
            Login
          </router-link>
          <router-link
            to="/signup"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            @click="handleSignupClick"
          >
            Get Started
          </router-link>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <section class="w-full py-12 md:py-24 lg:py-32 xl:py-48 border-b">
        <div class="container px-4 md:px-6 mx-auto">
          <div class="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div class="flex flex-col justify-center space-y-4">
              <div class="space-y-2">
                <h1 class="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Revolutionize Your Workflow
                </h1>
                <p class="max-w-[600px] text-muted-foreground md:text-xl">
                  Boost productivity and collaboration with our cutting-edge platform. Streamline tasks and achieve more.
                </p>
              </div>
              <div class="flex flex-col gap-2 min-[400px]:flex-row">
                <router-link
                  to="/signup"
                  class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  @click="handleGetStartedClick"
                >
                  Get Started
                </router-link>
                <router-link
                  to="/learn-more"
                  class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  @click="handleLearnMoreClick"
                >
                  Learn More
                </router-link>
              </div>
            </div>
            <img
              src="https://placehold.co/600x400/e2e8f0/64748b?text=App+Screenshot"
              alt="Hero Image Placeholder"
              width="600"
              height="400"
              class="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              @error="handleImageError"
            />
          </div>
        </div>
      </section>

      <section id="features" class="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div class="container px-4 md:px-6 mx-auto">
          <div class="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div class="space-y-2">
              <div class="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Key Features
              </div>
              <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">
                Simplify Your Operations
              </h2>
              <p class="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover the tools designed to enhance efficiency and foster teamwork across your projects.
              </p>
            </div>
          </div>
          <div class="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
            <div class="grid gap-4 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div class="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold">Save Time</h3>
              <p class="text-sm text-muted-foreground">
                Automate repetitive tasks and focus on what matters most with our intuitive tools.
              </p>
            </div>
            <div class="grid gap-4 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div class="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold">Improve Accuracy</h3>
              <p class="text-sm text-muted-foreground">
                Reduce errors and ensure data integrity with built-in validation and checks.
              </p>
            </div>
            <div class="grid gap-4 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div class="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold">Enhance Collaboration</h3>
              <p class="text-sm text-muted-foreground">
                Work together seamlessly with shared workspaces and real-time updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="py-6 md:px-8 md:py-0 border-t bg-background">
      <div class="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by
          <a href="#" target="_blank" rel="noreferrer" class="font-medium underline underline-offset-4" @click="handleCompanyClick">Your Company</a>.
          All rights reserved. &copy; {{ new Date().getFullYear() }}
        </p>
        <nav class="flex gap-4 sm:gap-6">
          <a class="text-sm text-muted-foreground hover:text-foreground" href="#" @click.prevent="handleTermsClick">Terms</a>
          <a class="text-sm text-muted-foreground hover:text-foreground" href="#" @click.prevent="handlePrivacyClick">Privacy</a>
        </nav>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Navigation handlers
const goToHome = () => {
  router.push('/')
}

const handleLoginClick = () => {
  router.push('/login')
}

const handleSignupClick = () => {
  router.push('/signup')
}

const handleGetStartedClick = () => {
  router.push('/signup')
}

const handleLearnMoreClick = () => {
  router.push('/learn-more')
}

// Image error handler
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/600x400/e0e0e0/a0a0a0?text=Image+Not+Found'
}

// Footer link handlers
const handleCompanyClick = (event) => {
  event.preventDefault()
  window.open('https://yourcompany.com', '_blank')
}

const handleTermsClick = (event) => {
  event.preventDefault()
  router.push('/terms')
}

const handlePrivacyClick = (event) => {
  event.preventDefault()
  router.push('/privacy')
}
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>

