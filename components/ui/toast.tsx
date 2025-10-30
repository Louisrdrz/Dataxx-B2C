import * as React from "react";

export interface ToastProps {
  className?: string;
  children?: React.ReactNode;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={className} {...props} />;
  }
);
Toast.displayName = "Toast";

export { Toast };

export interface ToastTitleProps {
  className?: string;
  children?: React.ReactNode;
}

const ToastTitle = React.forwardRef<HTMLDivElement, ToastTitleProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={className} {...props} />;
  }
);
ToastTitle.displayName = "ToastTitle";

export { ToastTitle };

export interface ToastDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

const ToastDescription = React.forwardRef<HTMLDivElement, ToastDescriptionProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={className} {...props} />;
  }
);
ToastDescription.displayName = "ToastDescription";

export { ToastDescription };

export interface ToastCloseProps {
  onClick?: () => void;
}

const ToastClose = React.forwardRef<HTMLButtonElement, ToastCloseProps>(
  ({ onClick, ...props }, ref) => {
    return <button ref={ref} onClick={onClick} {...props} />;
  }
);
ToastClose.displayName = "ToastClose";

export { ToastClose };

export interface ToastViewportProps {
  className?: string;
}

const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={className} {...props} />;
  }
);
ToastViewport.displayName = "ToastViewport";

export { ToastViewport };

export interface ToastProviderProps {
  children: React.ReactNode;
}

const ToastProvider = ({ children }: ToastProviderProps) => {
  return <>{children}</>;
};

export { ToastProvider };
