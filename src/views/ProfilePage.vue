<template>
  <div class="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <div
      class="bg-card text-card-foreground shadow-sm rounded-lg border border-border"
    >
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-semibold leading-6 text-foreground mb-6">
          {{ $t("profile.title", "Profile Settings") }}
        </h3>

        <div class="space-y-8">
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-6 space-y-4 sm:space-y-0"
          >
            <div class="relative flex-shrink-0">
              <img
                class="h-20 w-20 rounded-full object-cover border border-border"
                :src="profile.avatarUrl || 'https://placehold.co/150x150/e2e8f0/64748b?text=Avatar'"
                alt="Profile avatar"
                @error="handleImageError"
              />
              <button
                type="button"
                class="absolute bottom-0 right-0 inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-card"
                aria-label="Change avatar"
                @click="triggerFileInput"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              <input
                type="file"
                ref="fileInput"
                class="hidden"
                accept="image/*"
                @change="handleFileChange"
              />
            </div>
            <div class="flex-grow">
              <h4 class="text-base font-semibold text-foreground">
                {{ $t("profile.changeAvatar", "Update your photo") }}
              </h4>
              <p class="text-sm text-muted-foreground mt-1">
                {{
                  $t(
                    "profile.avatarDescription",
                    "Upload a new avatar. We recommend a 1:1 aspect ratio."
                  )
                }}
              </p>
              <button
                type="button"
                class="mt-2 inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                @click="triggerFileInput"
              >
                {{ $t("profile.uploadButton", "Upload Photo") }}
              </button>
            </div>
          </div>

          <div class="border-t border-border"></div>

          <div class="space-y-4">
            <h4 class="text-base font-semibold text-foreground">
              {{ $t("profile.personalInfo", "Personal Information") }}
            </h4>

            <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <label
                  for="fullName"
                  class="block text-sm font-medium text-muted-foreground mb-1"
                >
                  {{ $t("profile.fullName", "Full Name") }}
                </label>
                <input
                  type="text"
                  id="fullName"
                  v-model="profile.fullName"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-muted-foreground mb-1"
                >
                  {{ $t("profile.email", "Email Address") }}
                </label>
                <input
                  type="email"
                  id="email"
                  v-model="profile.email"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  for="phone"
                  class="block text-sm font-medium text-muted-foreground mb-1"
                >
                  {{ $t("profile.phone", "Phone Number") }}
                </label>
                <input
                  type="tel"
                  id="phone"
                  v-model="profile.phone"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  for="location"
                  class="block text-sm font-medium text-muted-foreground mb-1"
                >
                  {{ $t("profile.location", "Location") }}
                </label>
                <input
                  type="text"
                  id="location"
                  v-model="profile.location"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div class="border-t border-border"></div>

          <div>
            <label
              for="bio"
              class="block text-sm font-medium text-muted-foreground mb-1"
            >
              {{ $t("profile.bio", "Bio") }}
            </label>
            <textarea
              id="bio"
              v-model="profile.bio"
              rows="4"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              :placeholder="
                $t(
                  'profile.bioPlaceholder',
                  'Tell us a little about yourself...'
                )
              "
            ></textarea>
            <p class="mt-2 text-sm text-muted-foreground">
              {{
                $t(
                  "profile.bioDescription",
                  "Brief description for your profile."
                )
              }}
            </p>
          </div>

          <div class="flex justify-end pt-4">
            <button
              @click="saveProfile"
              type="button"
              class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              :disabled="isSaving"
            >
              <span v-if="isSaving" class="mr-2">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isSaving ? $t("profile.saving", "Saving...") : $t("profile.saveChanges", "Save Changes") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "@/components/ui/use-toast";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { toast } = useToast();
const fileInput = ref(null);
const isSaving = ref(false);

// Reactive state for profile data
const profile = ref({
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+84 123 456 789",
  location: "Ho Chi Minh City",
  bio: "Software developer with 5 years of experience in web development.",
  avatarUrl: null
});

// Trigger file input click
const triggerFileInput = () => {
  fileInput.value.click();
};

// Handle file selection
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast({
      title: t('profile.avatarError.title'),
      description: t('profile.avatarError.invalidType'),
      type: 'error'
    });
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast({
      title: t('profile.avatarError.title'),
      description: t('profile.avatarError.tooLarge'),
      type: 'error'
    });
    return;
  }

  // Create preview URL
  const reader = new FileReader();
  reader.onload = (e) => {
    profile.value.avatarUrl = e.target.result;
    toast({
      title: t('profile.avatarSuccess.title'),
      description: t('profile.avatarSuccess.message'),
      type: 'success'
    });
  };
  reader.readAsDataURL(file);
};

// Handle image load error
const handleImageError = () => {
  profile.value.avatarUrl = 'https://placehold.co/150x150/e0e0e0/a0a0a0?text=Error';
};

// Function to handle saving the profile
const saveProfile = async () => {
  isSaving.value = true;
  try {
    // TODO: Implement actual API call
    // const response = await fetch('/api/profile', {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(profile.value)
    // });
    // const data = await response.json();

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: t('profile.saveSuccess.title'),
      description: t('profile.saveSuccess.message'),
      type: 'success'
    });
  } catch (error) {
    console.error('Error saving profile:', error);
    toast({
      title: t('profile.saveError.title'),
      description: t('profile.saveError.message'),
      type: 'error'
    });
  } finally {
    isSaving.value = false;
  }
};
</script>
