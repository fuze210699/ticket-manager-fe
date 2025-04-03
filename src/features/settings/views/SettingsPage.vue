<template>
  <div class="max-w-4xl mx-auto py-4 sm:py-6 px-3 sm:px-4 lg:px-8">
    <div class="bg-white shadow rounded-lg">
      <div class="px-3 sm:px-4 py-4 sm:py-5 lg:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">{{ $t('settings.title') }}</h3>
        
        <div class="space-y-6">
          <!-- Account Settings -->
          <div class="space-y-4">
            <h4 class="text-lg font-medium text-gray-900">{{ $t('settings.accountSettings') }}</h4>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ $t('settings.currentPassword') }}</label>
              <input type="password" v-model="settings.currentPassword" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                :class="{ 'border-red-500': errors.currentPassword }">
              <p v-if="errors.currentPassword" class="mt-1 text-sm text-red-600">{{ errors.currentPassword }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ $t('settings.newPassword') }}</label>
              <input type="password" v-model="settings.newPassword" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                :class="{ 'border-red-500': errors.newPassword }">
              <p v-if="errors.newPassword" class="mt-1 text-sm text-red-600">{{ errors.newPassword }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ $t('settings.confirmPassword') }}</label>
              <input type="password" v-model="settings.confirmPassword" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                :class="{ 'border-red-500': errors.confirmPassword }">
              <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
            </div>
          </div>

          <!-- Notification Settings -->
          <div class="space-y-4">
            <h4 class="text-lg font-medium text-gray-900">{{ $t('settings.notificationSettings') }}</h4>
            
            <div class="flex items-center justify-between">
              <div class="flex-1 pr-4">
                <label class="text-sm font-medium text-gray-700">{{ $t('settings.emailNotifications') }}</label>
                <p class="text-sm text-gray-500">{{ $t('settings.emailNotificationsDescription') }}</p>
              </div>
              <button @click="settings.emailNotifications = !settings.emailNotifications" 
                :class="settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span :class="settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'"
                  class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out">
                </span>
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex-1 pr-4">
                <label class="text-sm font-medium text-gray-700">{{ $t('settings.pushNotifications') }}</label>
                <p class="text-sm text-gray-500">{{ $t('settings.pushNotificationsDescription') }}</p>
              </div>
              <button @click="settings.pushNotifications = !settings.pushNotifications"
                :class="settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span :class="settings.pushNotifications ? 'translate-x-5' : 'translate-x-0'"
                  class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out">
                </span>
              </button>
            </div>
          </div>

          <!-- Save Button -->
          <div class="flex justify-end pt-4">
            <button @click="saveSettings" 
              class="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="isSaving">
              {{ isSaving ? $t('common.loading') : $t('settings.saveChanges') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const isSaving = ref(false);

const settings = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  emailNotifications: true,
  pushNotifications: true
});

const errors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const validatePassword = () => {
  errors.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  let isValid = true;

  if (!settings.value.currentPassword) {
    errors.value.currentPassword = t('settings.invalidCurrentPassword');
    isValid = false;
  }

  if (settings.value.newPassword.length < 8) {
    errors.value.newPassword = t('settings.passwordTooShort');
    isValid = false;
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(settings.value.newPassword)) {
    errors.value.newPassword = t('settings.passwordRequirements');
    isValid = false;
  }

  if (settings.value.newPassword !== settings.value.confirmPassword) {
    errors.value.confirmPassword = t('settings.passwordMismatch');
    isValid = false;
  }

  return isValid;
};

const saveSettings = async () => {
  if (!validatePassword()) {
    return;
  }

  isSaving.value = true;
  try {
    // TODO: Implement save settings logic
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    console.log('Saving settings:', settings.value);
    // Show success message
  } catch (error) {
    console.error('Error saving settings:', error);
    // Show error message
  } finally {
    isSaving.value = false;
  }
};
</script> 
