<template>
  <div class="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-foreground">
          {{ $t('auth.createAccount', 'Create your account') }}
        </h2>
        <p class="mt-2 text-center text-sm text-muted-foreground">
          {{ $t('auth.alreadyHaveAccount', 'Already have an account?') }}
          <router-link
            to="/login"
            class="font-medium text-primary hover:text-primary/90"
          >
            {{ $t('auth.signIn', 'Sign in') }}
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="fullName" class="block text-sm font-medium text-muted-foreground">
              {{ $t('auth.fullName', 'Full Name') }}
            </label>
            <input
              id="fullName"
              v-model="form.fullName"
              type="text"
              required
              class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              :placeholder="$t('auth.fullNamePlaceholder', 'Enter your full name')"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-muted-foreground">
              {{ $t('auth.email', 'Email address') }}
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              :placeholder="$t('auth.emailPlaceholder', 'Enter your email')"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-muted-foreground">
              {{ $t('auth.password', 'Password') }}
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              :placeholder="$t('auth.passwordPlaceholder', 'Create a password')"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-muted-foreground">
              {{ $t('auth.confirmPassword', 'Confirm Password') }}
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              :placeholder="$t('auth.confirmPasswordPlaceholder', 'Confirm your password')"
            />
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.acceptTerms"
            type="checkbox"
            required
            class="h-4 w-4 rounded border-input text-primary focus:ring-primary"
          />
          <label for="terms" class="ml-2 block text-sm text-muted-foreground">
            {{ $t('auth.acceptTerms', 'I accept the') }}
            <a href="#" class="font-medium text-primary hover:text-primary/90">
              {{ $t('auth.termsOfService', 'Terms of Service') }}
            </a>
            {{ $t('auth.and', 'and') }}
            <a href="#" class="font-medium text-primary hover:text-primary/90">
              {{ $t('auth.privacyPolicy', 'Privacy Policy') }}
            </a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ isLoading ? $t('auth.creatingAccount', 'Creating account...') : $t('auth.createAccount', 'Create account') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/use-toast'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const isLoading = ref(false)

const form = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const handleSubmit = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    toast({
      title: t('auth.error.title'),
      description: t('auth.error.passwordMismatch'),
      type: 'error'
    })
    return
  }

  isLoading.value = true
  try {
    // TODO: Implement actual signup API call
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

    toast({
      title: t('auth.success.title'),
      description: t('auth.success.accountCreated'),
      type: 'success'
    })

    router.push('/login')
  } catch (error) {
    toast({
      title: t('auth.error.title'),
      description: t('auth.error.signupFailed'),
      type: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script> 