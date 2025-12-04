interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export const useToast = () => {
  return {
    toasts: [] as ToastProps[],
    toast: (_props?: ToastProps) => {},
    dismiss: () => {},
    toaster: null,
  };
};
