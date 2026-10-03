import Link from "next/link";
import AppointmentFlowClient from "@/components/appointment-flow/AppointmentFlowClient";

export default function AppointmentFlowPage() {
  return (
    <main className="appointment-flow-route">
      <nav className="appointment-flow-route__controls" aria-label="Appointment Flow showroom controls">
        <Link id="appointment-flow-return-to-examples" href="/demos">
          All examples
        </Link>
        <Link id="appointment-flow-enquiry-link" href="/#contact">
          Tell Motus what you need
        </Link>
      </nav>
      <AppointmentFlowClient />
    </main>
  );
}
