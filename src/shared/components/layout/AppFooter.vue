<template>
  <footer class="py-3 lg:py-0 border-t bg-background">
    <div
      class="container flex flex-col items-center justify-between gap-4 lg:h-16 lg:flex-row mx-auto px-4"
    >
      <p class="text-balance text-center text-sm leading-loose text-muted-foreground lg:text-left">
        Built by
        <a
          href="#"
          target="_blank"
          rel="noreferrer"
          class="font-medium underline underline-offset-4"
          @click="handleCompanyClick"
          >Your Company</a
        >. All rights reserved. &copy; {{ new Date().getFullYear() }}
      </p>
      <nav class="flex gap-4 lg:gap-6">
        <a
          class="text-sm text-muted-foreground hover:text-foreground"
          href="#"
          @click.prevent="handleTermsClick"
          >Terms</a
        >
        <a
          class="text-sm text-muted-foreground hover:text-foreground"
          href="#"
          @click.prevent="handlePrivacyClick"
          >Privacy</a
        >
      </nav>
    </div>
  </footer>
</template>

<script setup>
const handleCompanyClick = event => {
  event.preventDefault();
  window.open('https://yourcompany.com', '_blank');
};

const handleTermsClick = event => {
  event.preventDefault();
  window.location.href = '/terms';
};

const handlePrivacyClick = event => {
  event.preventDefault();
  window.location.href = '/privacy';
};
</script>
