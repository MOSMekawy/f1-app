import type { Metadata } from "next";
import "./globals.css";
import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
  createTheme,
} from "@mantine/core";
import { AppLayout } from "../shared/components/app-shell/app-shell.component";
import QueryProvider from "../shared/components/query-provider/query-provider.component";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "F1 App",
  description: "Formula 1 Historical Data",
};

const theme = createTheme({});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <QueryProvider>
          <MantineProvider theme={theme} forceColorScheme="dark">
            <AppLayout>
              <Suspense>
                {children}
              </Suspense>
            </AppLayout>
          </MantineProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
