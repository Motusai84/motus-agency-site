"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

const FigmaLedgerDesk = dynamic(
  () => import("@/components/ledger-desk/FigmaLedgerDesk"),
  { ssr: false },
);

const fixedButtonIds: Array<[RegExp, string]> = [
  [/^Recurring service/, "ledger-desk-pattern-recurring"],
  [/^Project milestone/, "ledger-desk-pattern-milestone"],
  [/^Completed job/, "ledger-desk-pattern-job"],
  [/^Follow this item$/, "ledger-desk-follow-item"],
  [/^Use approved .* amount/, "ledger-desk-use-approved-amount"],
  [/^Hold for checking/, "ledger-desk-hold-for-checking"],
  [/^(Choose an option above|Confirm and continue|Hold and continue)$/, "ledger-desk-confirm-decision"],
  [/^Return to review/, "ledger-desk-return-to-review"],
  [/^Restart preview$/, "ledger-desk-restart-preview"],
];

function buttonId(label: string) {
  const fixed = fixedButtonIds.find(([pattern]) => pattern.test(label));
  if (fixed) return fixed[1];

  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);

  return slug ? `ledger-desk-${slug}` : undefined;
}

/**
 * The approved Figma Make export remains isolated in FigmaLedgerDesk.
 * This adapter adds stable testing IDs without changing its visual composition.
 */
export default function LedgerDeskClient() {
  useEffect(() => {
    const labelControls = () => {
      document
        .querySelectorAll<HTMLButtonElement>(".ledger-desk-demo button")
        .forEach((button) => {
          const id = buttonId(button.textContent?.trim() ?? "");
          if (id && button.id !== id) button.id = id;
        });
    };

    labelControls();
    const observer = new MutationObserver(labelControls);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, []);

  return <FigmaLedgerDesk />;
}
