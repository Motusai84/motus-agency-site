export interface ImpactTask {
  id: string;
  label: string;
  countLabel: string;
  item: string;
}

export interface ImpactArea {
  id: string;
  label: string;
  tasks: ImpactTask[];
  help: string;
  demo: { label: string; href: string };
}

export interface ClientConfig {
  heading: string;
  introduction: string;
  contactHref: string;
  illustration: { timeReductionPercent: number; additionalCustomers: number };
  areas: ImpactArea[];
  adminExample: {
    area: string;
    task: string;
    count: number;
    before: number;
    hourlyValue: number;
    workingWeeks: number;
    workingDays: number;
    activeMonths: number;
  };
  enquiryExample: {
    enquiries: number;
    customers: number;
    saleValue: number;
    deliveryCost: number;
    activeMonths: number;
  };
}

export const businessImpact: ClientConfig = {
  heading: "Explore two ways we could help your business.",
  introduction: "Tell us how things work today. See what a simple improvement could be worth in time and money.",
  contactHref: "#contact",
  // Motus-selected illustrations, not predicted outcomes or client benchmarks.
  illustration: { timeReductionPercent: 50, additionalCustomers: 1 },
  areas: [
    {
      id: "enquiries", label: "Enquiries and follow-up",
      help: "Bring enquiry details together and prepare replies for your team to check, with a clear next action for each customer.",
      tasks: [
        { id: "record", label: "Recording enquiry details", countLabel: "Enquiries to record", item: "enquiry" },
        { id: "reply", label: "Preparing replies", countLabel: "Replies to prepare", item: "reply" },
        { id: "follow-up", label: "Checking who needs a follow-up", countLabel: "Follow-up checks", item: "check" },
      ],
      demo: { label: "Try Lead Hub", href: "/demos/lead-hub" },
    },
    {
      id: "bookings", label: "Bookings and appointments",
      help: "Collect booking details through a clear form and connect them to your tracker and calendar, with important changes coming back to you.",
      tasks: [
        { id: "details", label: "Collecting booking details", countLabel: "Bookings to organise", item: "booking" },
        { id: "confirmation", label: "Preparing confirmations", countLabel: "Confirmations to prepare", item: "confirmation" },
        { id: "changes", label: "Recording booking changes", countLabel: "Changes to record", item: "change" },
      ],
      demo: { label: "Try Appointment Flow", href: "/demos/appointment-flow" },
    },
    {
      id: "invoices", label: "Invoices and payments",
      help: "Bring job and billing details together and prepare invoice drafts for you to check, reducing repeated copying and typing.",
      tasks: [
        { id: "prepare", label: "Preparing invoices", countLabel: "Invoices to prepare", item: "invoice" },
        { id: "enter", label: "Entering billing details", countLabel: "Billing records to enter", item: "record" },
        { id: "unpaid", label: "Checking unpaid invoices", countLabel: "Invoice checks", item: "check" },
      ],
      demo: { label: "Try Ledger Desk", href: "/demos/ledger-desk" },
    },
    {
      id: "documents", label: "Documents and records",
      help: "Bring information from supported forms and records into one place, and flag missing details for your team to check.",
      tasks: [
        { id: "copy", label: "Copying details between tools", countLabel: "Records to copy", item: "record" },
        { id: "gather", label: "Gathering job documents", countLabel: "Sets of documents to gather", item: "set of documents" },
        { id: "check", label: "Checking for missing information", countLabel: "Records to check", item: "record" },
      ],
      demo: { label: "Explore Ledger Desk", href: "/demos/ledger-desk" },
    },
    {
      id: "property", label: "Property correspondence",
      help: "Keep related property emails together and prepare evidence-based replies for your team to check in their existing email tools.",
      tasks: [
        { id: "find", label: "Finding related emails", countLabel: "Email searches", item: "search" },
        { id: "organise", label: "Organising messages by property", countLabel: "Messages to organise", item: "message" },
        { id: "draft", label: "Preparing replies for review", countLabel: "Replies to prepare", item: "reply" },
      ],
      demo: { label: "Try Property Desk", href: "/demos/property-desk" },
    },
    {
      id: "other", label: "Other repeated admin",
      help: "Review the repeated steps with you and identify where a custom tool or connection could reduce the work. We explain what still needs a person.",
      tasks: [{ id: "other", label: "Another repeated task", countLabel: "Times this task is done", item: "task" }],
      demo: { label: "Explore our five demos", href: "/demos" },
    },
  ],
  // Illustrative inputs, not measured client outcomes or UK benchmarks.
  adminExample: { area: "invoices", task: "prepare", count: 30, before: 8, hourlyValue: 20, workingWeeks: 46, workingDays: 5, activeMonths: 12 },
  enquiryExample: { enquiries: 20, customers: 5, saleValue: 300, deliveryCost: 100, activeMonths: 12 },
};
