<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/80" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-card p-6 text-left align-middle shadow-xl transition-all border border-border bg-white"
            >
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-card-foreground">
                {{ t('home.createWorkspaceTitle') }}
              </DialogTitle>

              <div class="mt-4">
                <form @submit.prevent="handleSubmit">
                  <div class="space-y-4">
                    <div>
                      <label
                        for="workspace-name"
                        class="block text-sm font-medium text-muted-foreground"
                      >
                        {{ t('home.workspaceName') }}
                        <span class="text-red-500">*</span>
                      </label>
                      <div class="mt-1">
                        <input
                          id="workspace-name"
                          v-model="form.name"
                          type="text"
                          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          :placeholder="t('workspace.namePlaceholder')"
                          :aria-label="t('home.workspaceName')"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        for="workspace-description"
                        class="block text-sm font-medium text-muted-foreground"
                      >
                        {{ t('home.workspaceDescription') }}
                        <span class="text-gray-400 text-xs">({{ t('common.optional') }})</span>
                      </label>
                      <div class="mt-1">
                        <textarea
                          id="workspace-description"
                          v-model="form.description"
                          rows="3"
                          class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          :placeholder="t('workspace.descriptionPlaceholder')"
                          :aria-label="t('home.workspaceDescription')"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                      @click="closeModal"
                    >
                      {{ t('common.cancel') }}
                    </button>
                    <button
                      type="submit"
                      class="inline-flex h-10 items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                      :disabled="!isFormValid"
                    >
                      {{ t('home.create') }}
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Props definition for controlling the modal's visibility
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

// Emits definition for closing the modal and submitting the form
const emit = defineEmits(['close', 'create']);

// Reactive form state
const form = ref({
  name: '',
  description: '',
});

// Computed property to check if form is valid
const isFormValid = computed(() => {
  return form.value.name.trim().length > 0;
});

// Function to close the modal and reset the form
const closeModal = () => {
  form.value = { name: '', description: '' }; // Reset form on close
  emit('close'); // Emit close event
};

// Function to handle form submission
const handleSubmit = () => {
  if (isFormValid.value) {
    // Emit create event with a copy of the form data
    emit('create', {
      name: form.value.name.trim(),
      description: form.value.description.trim(),
    });
    // Close the modal after successful submission
    closeModal();
  }
};
</script>
