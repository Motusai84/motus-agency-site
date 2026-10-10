export type DemoSector =
  | "Appointment-led services"
  | "Recruitment"
  | "Property and lettings"
  | "Business operations"
  | "Accountancy and finance"
  | "Trades and field services"
  | "Marketing agencies"
  | "Insurance brokers";

export type DemoSolution =
  | "Websites and landing pages"
  | "Bookings and enquiries"
  | "Portals and workspaces"
  | "Dashboards and reporting"
  | "Managed automation";

export type DemoRecord = {
  slug: string;
  sector: DemoSector;
  title: string;
  category?: string;
  name?: string;
  demoSummary?: string;
  startHint?: string;
  enquiryOutcome?: string;
  problem: string;
  interfaceSummary: string;
  views: string[];
  outcomes: string[];
  workflowFamily: string;
  solutions: DemoSolution[];
  ctaLabel?: string;
  scopeLabel?: string;
  boundary?: string;
  caseStudy?: { brief: string; decisions: Array<{ title: string; detail: string }>; tryIt: string };
  status: "planned" | "ready";
  url?: string;
};

export const demoSectors: Array<"All sectors" | DemoSector> = [
  "All sectors",
  "Appointment-led services",
  "Recruitment",
  "Property and lettings",
  "Business operations",
  "Accountancy and finance",
  "Trades and field services",
  "Marketing agencies",
  "Insurance brokers",
];

export const demoSolutions: Array<"All solutions" | DemoSolution> = [
  "All solutions",
  "Websites and landing pages",
  "Bookings and enquiries",
  "Portals and workspaces",
  "Dashboards and reporting",
  "Managed automation",
];

export const demoCatalog: DemoRecord[] = [
  {
    slug: "salon-website",
    sector: "Appointment-led services",
    title: "Crown & Coil — a complete salon website",
    category: "Websites",
    name: "Salon website",
    demoSummary: "Explore a complete salon website with services, a product collection and booking previews.",
    startHint: "Choose a service, try an appointment request and explore the example collection.",
    enquiryOutcome: "Get online professionally",
    problem: "Customers need an easy way to explore your services, choose a product and ask about an appointment.",
    interfaceSummary: "A fictional hair studio website with a service menu, filterable collection, demo bag, appointment preview and photo gallery.",
    views: ["Salon website", "Appointment request preview", "Product collection and enquiry preview"],
    outcomes: ["Show your services clearly", "Help customers find their next step", "Give your business its own visual identity"],
    workflowFamily: "A website, services and product enquiries shaped around your business",
    solutions: ["Websites and landing pages", "Bookings and enquiries"],
    ctaLabel: "Explore the salon website",
    scopeLabel: "Your own brand, content and booking process, with a price agreed before work starts.",
    boundary: "Fictional salon, example prices and stock photography. No appointment, order, payment or message is created.",
    caseStudy: {
      brief: "Give a fictional hair studio a distinct identity while making services, products and the next appointment easy to explore.",
      decisions: [
        { title: "Character through photography", detail: "Portraits celebrate Black women and natural texture. Separate photographs of wigs and extensions make the collection easier to understand." },
        { title: "A calm appointment menu", detail: "One featured treatment introduces the services. A clear price and duration menu helps visitors compare the remaining appointments." },
        { title: "Space for the hair to speak", detail: "Warm neutrals, expressive serif headings and an asymmetric photo edit give the studio character. Quiet transitions keep attention on the content." },
      ],
      tryIt: "Choose a service, move through both booking steps, then try a product length, add it to your bag and change the quantity. The experience works on a phone and with a keyboard.",
    },
    status: "ready",
    url: "/demos/salon-website",
  },
  {
    slug: "appointment-enquiry-recovery",
    sector: "Appointment-led services",
    title: "Appointment Flow — what happens after a customer books?",
    category: "Bookings",
    name: "Appointment Flow",
    demoSummary: "See how a customer books a time and your team keeps track of the booking.",
    startHint: "Choose a time. Follow the confirmation and see what happens when a booking needs attention.",
    enquiryOutcome: "Make booking easier",
    problem:
      "Taking bookings is one thing. Keeping confirmations, changes and the team calendar in order is another.",
    interfaceSummary:
      "See a customer choose a time, receive a confirmation and appear in the team calendar. A booking problem comes back to the owner to decide.",
    views: ["Choose a time", "Confirmation and team calendar", "Review a booking problem"],
    outcomes: ["Bookings in one place", "Clear updates for the team", "The owner handles changes that need a decision"],
    workflowFamily: "Booking pages, confirmations and a clear view for your team",
    solutions: ["Websites and landing pages", "Bookings and enquiries", "Dashboards and reporting", "Managed automation"],
    ctaLabel: "Try the booking demo",
    scopeLabel: "Built around your booking process, with a price agreed before work starts.",
    boundary:
      "Demo with fictional people and bookings. Nothing is booked or sent, and no real calendar is changed.",
    status: "ready",
    url: "/demos/appointment-flow",
  },
  {
    slug: "recruitment-candidate-pipeline",
    sector: "Recruitment",
    title: "A candidate pipeline that shows what needs action",
    problem:
      "Candidate applications arrive from different places, acknowledgements are inconsistent and consultants lose time checking who owns the next step.",
    interfaceSummary:
      "A candidate application experience paired with a consultant pipeline for new applications, interviews, missing information and exceptions.",
    views: ["Candidate application", "Consultant pipeline"],
    outcomes: ["Applications recorded", "Ownership visible", "Exceptions ready for review"],
    workflowFamily: "Candidate intake, acknowledgement, routing and interview administration",
    solutions: ["Websites and landing pages", "Portals and workspaces", "Dashboards and reporting", "Managed automation"],
    status: "planned",
  },
  {
    slug: "lettings-renewal-pipeline",
    sector: "Property and lettings",
    title: "Renewals, replies and deadlines in one controlled view",
    problem:
      "Renewal dates, landlord decisions, tenant replies and document preparation can become scattered across inboxes and spreadsheets.",
    interfaceSummary:
      "A tenant or landlord response experience connected to a renewal pipeline showing deadlines, missing replies and decisions still required.",
    views: ["Response experience", "Renewal dashboard"],
    outcomes: ["Upcoming renewals visible", "Replies attached to the right case", "Outstanding decisions prioritised"],
    workflowFamily: "Renewal identification, communications, follow-up and record updates",
    solutions: ["Portals and workspaces", "Dashboards and reporting", "Managed automation"],
    status: "planned",
  },
  {
    slug: "ledger-desk",
    sector: "Business operations",
    title: "Ledger Desk — from finished work to invoice review",
    category: "Invoices",
    name: "Ledger Desk",
    demoSummary: "See how a finished job becomes an invoice draft you can check before sending.",
    startHint: "Choose how you bill. Follow a finished job into an invoice draft and check the details.",
    enquiryOutcome: "Stay on top of invoices",
    problem:
      "The work is finished, but the details you need to prepare the invoice are spread across messages and job records.",
    interfaceSummary:
      "See the finished work and agreed price brought together in an invoice draft. When two amounts differ, the owner checks which one is right.",
    views: ["Choose how you bill", "Gather the job details", "Check the invoice draft"],
    outcomes: ["See work that is ready to bill", "Find the details in one place", "Check unclear amounts before invoicing"],
    workflowFamily: "Finished-job records and invoice preparation",
    solutions: ["Dashboards and reporting", "Managed automation"],
    ctaLabel: "Try the invoice demo",
    scopeLabel: "Built around how you bill, with a price agreed before work starts.",
    boundary:
      "Demo with fictional jobs and invoices. Nothing is sent and no accounting record is changed.",
    status: "ready",
    url: "/demos/ledger-desk",
  },
  {
    slug: "lead-hub",
    sector: "Business operations",
    title: "Lead Hub — from first enquiry to a clear next step",
    category: "Customer enquiries",
    name: "Lead Hub",
    demoSummary: "See how customer messages come together so your team knows who needs a reply.",
    startHint: "Choose where a message arrives. See the details together and decide how to follow up.",
    enquiryOutcome: "Keep track of enquiries",
    problem:
      "Customer messages arrive through your website, phone, email and social media. It can be hard to keep track of who needs a reply.",
    interfaceSummary:
      "Keep the original message, gather the useful details and make it clear who should reply. The team checks the next step before anything is sent.",
    views: ["Read the original message", "See the details and what is missing", "Choose the next step"],
    outcomes: ["Keep the original message", "Know who needs to reply", "Check the follow-up before sending"],
    workflowFamily: "Customer messages, shared records and follow-up",
    solutions: ["Bookings and enquiries", "Portals and workspaces", "Managed automation"],
    ctaLabel: "Try the enquiry demo",
    scopeLabel: "Built around how customers contact you, with a price agreed before work starts.",
    boundary:
      "Demo with fictional people and messages. Nothing is sent or booked, and no real customer records are changed.",
    status: "ready",
    url: "/demos/lead-hub",
  },
  {
    slug: "trades-job-control",
    sector: "Trades and field services",
    title: "From new enquiry to completed job and invoice-ready record",
    problem:
      "Quotes, job updates, materials and completed-work details often sit across messages, paper notes and different members of staff.",
    interfaceSummary:
      "A quote or service landing page and staff job update connected to an owner view of quotes, active jobs, materials and invoice-ready work.",
    views: ["Quote or service page", "Staff job update", "Owner job control"],
    outcomes: ["Quote interest captured", "Completed work recorded", "Invoice blockers visible"],
    workflowFamily: "Lost Enquiry Recovery, quote follow-up and job-to-invoice administration",
    solutions: [
      "Websites and landing pages",
      "Bookings and enquiries",
      "Portals and workspaces",
      "Dashboards and reporting",
      "Managed automation",
    ],
    status: "planned",
  },
  {
    slug: "agency-reporting-approvals",
    sector: "Marketing agencies",
    title: "Client reporting with missing inputs and approvals made visible",
    problem:
      "Performance data, commentary, client approvals and delivery dates are repeatedly assembled by hand across several accounts.",
    interfaceSummary:
      "A client request or approval experience connected to an account-team view of reporting progress, missing inputs and delivery exceptions.",
    views: ["Client approval", "Reporting control view"],
    outcomes: ["Inputs gathered", "Approvals visible", "Late reports identified"],
    workflowFamily: "Reporting preparation, review routing and controlled client delivery",
    solutions: ["Portals and workspaces", "Dashboards and reporting", "Managed automation"],
    status: "planned",
  },
  {
    slug: "insurance-renewal-control",
    sector: "Insurance brokers",
    title: "Policy renewals that reach the right decision in time",
    problem:
      "Renewal dates, client information, comparison work and follow-up actions can be missed when each case depends on memory.",
    interfaceSummary:
      "A client renewal or information-request experience connected to a broker view of deadlines, outstanding documents, follow-ups and decisions.",
    views: ["Client renewal request", "Broker renewal desk"],
    outcomes: ["Renewals identified", "Missing information flagged", "Next action assigned"],
    workflowFamily: "Renewal identification, document preparation, communications and outcome logging",
    solutions: ["Portals and workspaces", "Dashboards and reporting", "Managed automation"],
    status: "planned",
  },
];

/** Only reviewed public examples can be carried into the enquiry form. */
export function getDemoEnquiryHref(slug: string) {
  const example = demoCatalog.find((demo) => demo.slug === slug && demo.status === "ready" && demo.url);
  return example ? `/?example=${encodeURIComponent(example.slug)}#contact` : "/#contact";
}
