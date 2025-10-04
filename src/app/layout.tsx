
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LinguaLeap",
  description: "Learn languages with AI",
  icons: {
    icon: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgU2j2SqqSj1gPLQ80AYIXTQqD3BVCWgaXhJEBGtuMEWDwm29iCo4YDIXJ6Lg1IzL2wLxrVxhszKaINk6RPDuYbyycJCBjH7Fm_ovrKoTQnCoqFh_N-DrWcZufXAHn1ohodaUWmVit2Win-JGf8r8JwR-fgygVllHec3sWkioFg0orUTmx4js0lc1BzWJQa/s1600/favicon-32x32.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>{children}</AuthProvider>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
