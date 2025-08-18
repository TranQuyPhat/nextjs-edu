"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TourProvider } from "@reactour/tour";
import { useState } from "react";
import { steps } from "./quizzes/components/steps";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>
      <TourProvider
        steps={steps}
        showBadge={false}
        showCloseButton
        showNavigation
        showDots
        disableDotsNavigation={false}
        className="eduquiz-tour"
        styles={{
          popover: (base) => ({
            ...base,
            "--reactour-accent": "#10b981",
            borderRadius: "16px",
            boxShadow:
              "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(16, 185, 129, 0.1)",
            maxWidth: "420px",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            border: "2px solid #10b981",
          }),
          maskArea: (base) => ({ ...base, rx: 12 }),
          badge: (base) => ({
            ...base,
            left: "auto",
            right: "-0.8125em",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          }),
        }}
        padding={{
          mask: [15, 15, 15, 15],
          popover: [15, 15, 15, 15],
        }}
        onClickMask={({ setCurrentStep, currentStep, steps, setIsOpen }) => {
          if (steps) {
            if (currentStep === steps.length - 1) setIsOpen(false);
            setCurrentStep((s) => (s === steps.length - 1 ? 0 : s + 1));
          }
        }}
      >
        {children}
      </TourProvider>
    </QueryClientProvider>
  );
}
