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
  problem: string;
  interfaceSummary: string;
  views: string[];
  outcomes: string[];
  workflowFamily: string;
  solutions: DemoSolution[];
  ctaLabel?: string;
  scopeLabel?: string;
  boundary?: string;
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
    slug: "appointment-enquiry-recovery",
    sector: "Appointment-led services",
    title: "Appointment Flow — what happens after a customer books?",
    problem:
      "An appointment-led business needs a clear view of what happens after a customer picks a time, including the cases that still need a person.",
    interfaceSummary:
      "A fictional guided journey from choosing a time through an illustrative confirmation, team calendar, customer message and owner-reviewed exception.",
    views: ["Customer time selection", "Illustrative confirmation and team view", "Owner exception review"],
    outcomes: ["Journey made visible", "Fictional records shown in context", "Human exception remains a decision"],
    workflowFamily: "Appointment booking, confirmation and owner exception control",
    solutions: ["Websites and landing pages", "Bookings and enquiries", "Dashboards and reporting", "Managed automation"],
    ctaLabel: "Explore Appointment Flow",
    scopeLabel: "Booking journey, operational view and managed automation — scoped and quoted",
    boundary:
      "Illustrative showroom example using fictional people, records and messages. It is not a live booking, calendar, email, messaging or customer-data system.",
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
    problem:
      "Completed work can sit across approvals, messages and job records without a clear billing next step.",
    interfaceSummary:
      "A fictional guided journey showing how completed work, supporting evidence and the approved amount can become a review-ready invoice draft while one inconsistency stays with the owner.",
    views: ["Billing-pattern choice", "Evidence-to-draft journey", "Owner exception review"],
    outcomes: ["Completed work made visible", "Billing details gathered", "Final decision remains with the owner"],
    workflowFamily: "Billing Control Setup",
    solutions: ["Dashboards and reporting", "Managed automation"],
    ctaLabel: "Explore Ledger Desk",
    scopeLabel: "Billing-control setup and managed automation — scoped and quoted",
    boundary:
      "Illustrative showroom example using fictional data. Nothing is sent and no accounting record is changed.",
    status: "ready",
    url: "/demos/ledger-desk",
  },
  {
    slug: "lead-hub",
    sector: "Business operations",
    title: "Lead Hub — from first enquiry to a clear next step",
    problem:
      "Enquiries can arrive through a website, phone, social channel, shared inbox or introducer without a clear owner or the information needed to respond well.",
    interfaceSummary:
      "A fictional source-first journey showing how the original enquiry stays intact while a team makes ownership, missing information and the appropriate human next step clear.",
    views: ["Original source enquiry", "Organised context and missing information", "Employee decision and prepared next step"],
    outcomes: ["Source context retained", "Ownership made visible", "Human follow-up stays controlled"],
    workflowFamily: "Enquiry intake, review routing and controlled follow-up",
    solutions: ["Bookings and enquiries", "Portals and workspaces", "Managed automation"],
    ctaLabel: "Explore Lead Hub",
    scopeLabel: "Enquiry-control setup and managed automation — scoped and quoted",
    boundary:
      "Illustrative showroom example using fictional people, records and messages. Nothing is sent, booked, approved or merged.",
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
