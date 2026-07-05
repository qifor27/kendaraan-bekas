"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

/** Light-mode toast host. Rendered once at the root layout. */
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="top-center"
      richColors
      toastOptions={{
        style: {
          borderRadius: "var(--radius)",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
