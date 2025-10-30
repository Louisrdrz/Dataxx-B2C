export const useToast = () => {
  return {
    toasts: [],
    toast: () => {},
    dismiss: () => {},
    toaster: null,
  };
};
