import { ref } from 'vue';

const toast = ref({
  show: false,
  message: '',
  type: 'info',
});

export function useToast() {
  const showToast = (message, type = 'success', duration = 3000) => {
    toast.value = {
      show: true,
      message,
      type,
    };
    setTimeout(() => {
      toast.value.show = false;
    }, duration);
  };

  const success = (message, duration = 3000) => {
    showToast(message, 'success', duration);
  };

  const error = (message, duration = 3000) => {
    showToast(message, 'error', duration);
  };

  const warning = (message, duration = 3000) => {
    showToast(message, 'warning', duration);
  };

  const info = (message, duration = 3000) => {
    showToast(message, 'info', duration);
  };

  const hide = () => {
    toast.value.show = false;
  };

  return {
    toast,
    showToast,
    success,
    error,
    warning,
    info,
    hide,
  };
}

export { toast };
