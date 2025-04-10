<template>
  <div class="bg-background">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div
          class="relative z-10 pb-8 bg-background sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32"
        >
          <main
            class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28"
          >
            <div class="sm:text-center lg:text-left">
              <h1
                class="text-4xl tracking-tight font-extrabold text-foreground sm:text-5xl md:text-6xl"
              >
                <span class="block">{{
                  $t('learnMore.hero.title', 'Transform Your Project Management')
                }}</span>
                <span class="block text-primary">{{
                  $t('learnMore.hero.subtitle', 'With Our Smart Solution')
                }}</span>
              </h1>
              <p
                class="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
              >
                {{
                  $t(
                    'learnMore.hero.description',
                    'Streamline your workflow, boost productivity, and achieve better results with our comprehensive project management platform.'
                  )
                }}
              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <router-link
                    to="/signup"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10"
                  >
                    {{ $t('learnMore.hero.getStarted', 'Get Started') }}
                  </router-link>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <LearnMoreButton @click="scrollToFeatures" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="py-12 bg-background">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-primary font-semibold tracking-wide uppercase">
            {{ $t('learnMore.features.title', 'Features') }}
          </h2>
          <p
            class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            {{ $t('learnMore.features.subtitle', 'Everything you need to manage your projects') }}
          </p>
        </div>

        <div class="mt-10">
          <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <!-- Feature 1 -->
            <div class="relative">
              <dt>
                <div
                  class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground"
                >
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-foreground">
                  {{ $t('learnMore.features.taskManagement.title', 'Task Management') }}
                </p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-muted-foreground">
                {{
                  $t(
                    'learnMore.features.taskManagement.description',
                    'Organize and track tasks with ease. Set priorities, deadlines, and dependencies.'
                  )
                }}
              </dd>
            </div>

            <!-- Feature 2 -->
            <div class="relative">
              <dt>
                <div
                  class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground"
                >
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-foreground">
                  {{ $t('learnMore.features.teamCollaboration.title', 'Team Collaboration') }}
                </p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-muted-foreground">
                {{
                  $t(
                    'learnMore.features.teamCollaboration.description',
                    'Work together seamlessly with real-time updates, comments, and file sharing.'
                  )
                }}
              </dd>
            </div>

            <!-- Feature 3 -->
            <div class="relative">
              <dt>
                <div
                  class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground"
                >
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-foreground">
                  {{ $t('learnMore.features.analytics.title', 'Analytics & Reporting') }}
                </p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-muted-foreground">
                {{
                  $t(
                    'learnMore.features.analytics.description',
                    'Get insights into project progress, team performance, and resource utilization.'
                  )
                }}
              </dd>
            </div>

            <!-- Feature 4 -->
            <div class="relative">
              <dt>
                <div
                  class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground"
                >
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-foreground">
                  {{ $t('learnMore.features.timeTracking.title', 'Time Tracking') }}
                </p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-muted-foreground">
                {{
                  $t(
                    'learnMore.features.timeTracking.description',
                    'Monitor time spent on tasks and projects with built-in time tracking tools.'
                  )
                }}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-primary">
      <div
        class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between"
      >
        <h2 class="text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl">
          <span class="block">{{ $t('learnMore.cta.title', 'Ready to get started?') }}</span>
          <span class="block text-primary-foreground/90">{{
            $t('learnMore.cta.subtitle', 'Start your free trial today.')
          }}</span>
        </h2>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div class="inline-flex rounded-md shadow">
            <router-link
              to="/signup"
              class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-primary-foreground hover:bg-primary-foreground/90"
            >
              {{ $t('learnMore.cta.button', 'Get started') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LearnMoreButton from '@core/ui/button/LearnMoreButton.vue';

const scrollToFeatures = () => {
  const featuresElement = document.getElementById('features');
  if (featuresElement) {
    featuresElement.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>
