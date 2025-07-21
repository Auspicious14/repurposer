import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { AppContextProvider } from "@/context";
import RootLayout from "@/modules/layout"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <RootLayout
        <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
      </RootLayout>
    </AppContextProvider>
  );
}
