import type { Metadata } from "next";
import "./globals.css";
import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
} from "@mantine/core";
import appTheme from "./app-theme";
import { AppLayout } from "@/shared/components/generic/app-shell/app-shell.component";
import QueryProvider from "@/shared/components/generic/query-provider/query-provider.component";

export const metadata: Metadata = {
  title: "F1 App",
  description: "Formula 1 Historical Data",
};

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
          <MantineProvider theme={appTheme}>
            <AppLayout>
                {children}
            </AppLayout>
          </MantineProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
