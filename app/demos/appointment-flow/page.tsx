import Link from "next/link";
import AppointmentFlowClient from "@/components/appointment-flow/AppointmentFlowClient";
import { getDemoEnquiryHref } from "@/lib/demo-catalog";

export default function AppointmentFlowPage() {
  return (
    <main className="appointment-flow-route">
      <nav className="appointment-flow-route__controls" aria-label="Appointment Flow showroom controls">
        <Link id="appointment-flow-return-to-examples" href="/demos">
          All examples
        </Link>
        <Link id="appointment-flow-enquiry-link" href={getDemoEnquiryHref("appointment-enquiry-recovery")}>
          Ask about this
        </Link>
      </nav>
      <AppointmentFlowClient />
      <footer className="appointment-flow-route__enquiry">
        <p>Want something like this for your business?</p>
        <Link id="appointment-flow-final-enquiry-link" href={getDemoEnquiryHref("appointment-enquiry-recovery")}>
          Ask about this for your business
        </Link>
      </footer>
    </main>
  );
}
