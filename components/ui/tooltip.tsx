import * as React from "react";

export interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
}

export const TooltipProvider = ({ children }: TooltipProviderProps) => {
  return <>{children}</>;
};
