import React, { FC, ComponentProps, JSX } from "react";
import { Toaster } from "sonner";
import { AuthContextProvider } from "../modules/auth/context";
import { ThemeContextProvider } from "./theme";
import { TemplatesProvider } from "@/modules/templates/context";
import { HistoryContextProvider } from "@/modules/history/context";
import { TranscribeContextProvider } from "@/modules/repurpose/context";

export const combineContext = (...components: FC[]): FC<any> => {
  const CombinedComponent = components.reduce(
    (AccumulatedComponents: any, CurrentComponent: any) => {
      const WrapperComponent: FC<any> = ({
        children,
        ...props // Accept all props
      }: ComponentProps<FC<any>>): JSX.Element => {
        return (
          <AccumulatedComponents {...props}>
            <CurrentComponent {...props}>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };

      WrapperComponent.displayName = `Combined(${
        CurrentComponent.displayName || CurrentComponent.name || "Unknown"
      })`;

      return WrapperComponent;
    },
    ({ children, ...props }: any) => (
      <>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--background)",
              color: "var(--text-primary)",
            },
          }}
        />
      </>
    )
  );

  return CombinedComponent;
};

const providers = [
  AuthContextProvider,
  ThemeContextProvider,
  TemplatesProvider,
  HistoryContextProvider,
  TranscribeContextProvider,
] as any;
export const AppContextProvider = combineContext(...providers);
