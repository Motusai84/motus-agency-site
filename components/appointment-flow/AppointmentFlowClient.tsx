"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

const FigmaAppointmentFlow = dynamic(
  () => import("@/components/appointment-flow/FigmaAppointmentFlow"),
  { ssr: false },
);

const fixedButtonIds: Record<string, string> = {
  "See how it works": "appointment-flow-start",
  "← Back": "appointment-flow-back",
  "Reassign to Sam →": "appointment-flow-reassign",
  "Reassigning to Sam…": "appointment-flow-reassign",
  "Cancel and notify Maya": "appointment-flow-cancel",
  "Try reassign instead": "appointment-flow-try-reassign",
  "← Start over": "appointment-flow-restart",
  "Step 1 again →": "appointment-flow-step-one",
  "See the final record →": "appointment-flow-show-final-record",
};

function buttonId(label: string) {
  if (fixedButtonIds[label]) return fixedButtonIds[label];

  if (/^\d{1,2}:\d{2} (am|pm)$/.test(label)) {
    return `appointment-flow-slot-${label.replace(/[^a-z0-9]+/gi, "-").replace(/-+$/, "").toLowerCase()}`;
  }

  return undefined;
}

/** The Figma Make export is intentionally kept unchanged in FigmaAppointmentFlow. */
export default function AppointmentFlowClient() {
  useEffect(() => {
    const labelButtons = () => {
      document.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
        const id = buttonId(button.textContent?.trim() ?? "");
        if (id) button.id = id;
      });
    };

    labelButtons();
    const observer = new MutationObserver(labelButtons);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  return <FigmaAppointmentFlow />;
}
