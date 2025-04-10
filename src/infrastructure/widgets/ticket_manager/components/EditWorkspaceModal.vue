<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog class="relative z-50" as="div" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
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
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-border">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-card-foreground">
                {{ $t('workspace.editTitle') }}
              </DialogTitle>
              <div class="mt-4">
                <form class="space-y-4" @submit.prevent="handleSubmit">
                  <div>
                    <label for="name" class="block text-sm font-medium text-muted-foreground">
                      {{ $t('workspace.name') }}
                      <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      required
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      :placeholder="$t('workspace.namePlaceholder')"
                    />
                  </div>
                  <div>
                    <label for="description" class="block text-sm font-medium text-muted-foreground">
                      {{ $t('workspace.description') }}
                      <span class="text-gray-400 text-xs">({{ $t('common.optional') }})</span>
                    </label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      rows="3"
                      class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      :placeholder="$t('workspace.descriptionPlaceholder')"
                    />
                  </div>
                  <div>
                    <label for="members" class="block text-sm font-medium text-muted-foreground">
                      {{ $t('workspace.members') }}
                      <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="members"
                      v-model.number="form.members"
                      type="number"
                      min="1"
                      required
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      :placeholder="$t('workspace.membersPlaceholder')"
                    />
                  </div>
                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                      @click="$emit('close')"
                    >
                      {{ $t('common.cancel') }}
                    </button>
                    <button
                      type="submit"
                      class="inline-flex h-10 items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                      {{ $t('common.save') }}
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
import { ref, onMounted } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  workspace: {
    type: Object,
    required: true,
    validator: (value) => value !== null,
  },
});

const emit = defineEmits(['close', 'update']);

const form = ref({
  name: '',
  description: '',
  members: 1,
});

onMounted(() => {
  if (props.workspace) {
    form.value = {
      name: props.workspace.name,
      description: props.workspace.description,
      members: props.workspace.members,
    };
  }
});

const handleSubmit = () => {
  if (!props.workspace) return;
  
  emit('update', {
    ...props.workspace,
    name: form.value.name,
    description: form.value.description,
    members: form.value.members,
    elements: props.workspace.elements || []
  });
  emit('close');
};
</script> 