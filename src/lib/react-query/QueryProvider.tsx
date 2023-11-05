import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React from "react";

// initialisasi react query di dalam app

const queryClient = new QueryClient();

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
