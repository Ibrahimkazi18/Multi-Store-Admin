import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { ModalProvider } from "@/providers/modal-provider";
import { ToastProvider } from "@/providers/toast-provider";

const poppins = Poppins({ subsets: ["latin"], weight: ["100","200","300","400","500","600","700","800","900"] });

export const metadata: Metadata = {
  title: "Multi-Store Admin Portal",
  description: "Manage your store on a single place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={poppins.className}>
            <ModalProvider />
            <ToastProvider />
            {children}
          </body>
      </html>
    </ClerkProvider>
  );
}
