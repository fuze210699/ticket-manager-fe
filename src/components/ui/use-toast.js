import { ref } from 'vue';
import { createVNode, render } from 'vue';
import Toast from './toast/Toast.vue';

const toasts = ref([]);

export function useToast() {
  const toast = ({ title, description, type = 'info', duration = 5000 }) => {
    const container = document.createElement('div');
    container.className = 'fixed top-4 right-4 z-50';
    document.body.appendChild(container);

    const vnode = createVNode(Toast, {
      title,
      description,
      type,
      duration,
      onClose: () => {
        render(null, container);
        container.remove();
      }
    });

    render(vnode, container);
    toasts.value.push(vnode);
  };

  return {
    toast,
    toasts
  };
} 