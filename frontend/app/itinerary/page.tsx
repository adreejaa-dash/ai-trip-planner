"use client";

import { Suspense } from "react";
import ItineraryContent from "./ItineraryContent";

export default function ItineraryPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--background)",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              border: "3px solid var(--surface-3)",
              borderTopColor: "var(--accent-blue)",
              borderRadius: "50%",
              animation: "spin-slow 0.8s linear infinite",
            }}
          />
        </div>
      }
    >
      <ItineraryContent />
    </Suspense>
  );
}
