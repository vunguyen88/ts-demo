"use client";

import React from "react";
import { ThemeProvider } from "@material-tailwind/react";

interface LayoutProps {
  children: any;
}

export function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}

export default Layout;