import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import "../styles/globals.css";
import { Toaster } from "sonner";
import { AppContextProvider } from "@/context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </AppContextProvider>
  );
}
