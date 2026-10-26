// Fictional demonstration content derived from the supplied discovery transcript.
// No live customer data, mailbox addresses or property-system connections.
export type PropertyKey = "alder" | "canal" | "elm";
export type Tone = "rose" | "amber" | "blue" | "violet" | "green";

export type MailProvider = "gmail" | "outlook";
export const mailProviders = {
  gmail: { name: "Gmail", vendor: "Google", compose: "Compose", saved: "Starred", mark: "Star", unmark: "Unstar", sent: "Sent", grouping: "Labels" },
  outlook: { name: "Outlook", vendor: "Microsoft", compose: "New mail", saved: "Flagged", mark: "Flag", unmark: "Unflag", sent: "Sent Items", grouping: "Categories" },
} satisfies Record<MailProvider, { name: string; vendor: string; compose: string; saved: string; mark: string; unmark: string; sent: string; grouping: string }>;

export type AttentionTarget = "report" | "address" | "property" | "issue" | "category" | "related-leak" | "related-quote" | "related-landlord" | "related-insurance" | "quote" | "draft" | "source-quote" | "draft-quote" | "review";

export interface DraftEvidence {
  id: string;
  text: string;
  note: string;
  sources: { emailId: string; highlights: string[] }[];
}

const draftEvidence: DraftEvidence[] = [
  { id: "report", text: "Talia reported further water coming through the kitchen ceiling at Flat 2 at 09:08 today.", note: "The tenant describes the leak. The report time comes from the email timestamp.", sources: [{ emailId: "leak", highlights: ["Water is coming through the kitchen ceiling", "Alder Court, Flat 2"] }] },
  { id: "quote", text: "Owen has offered an inspection this afternoon, subject to our approval of his £285 quote.", note: "An offer and a price, not a confirmed booking. The contractor explicitly asks for confirmation.", sources: [{ emailId: "quote", highlights: ["I can inspect the leak at Flat 2 this afternoon.", "The inspection quote is £285.", "Please confirm before I book the visit."] }] },
  { id: "photos", text: "Northstar Claims has requested photographs and the date the damage was first reported.", note: "This is a request for evidence. It does not confirm that the claim is approved or the photos have been supplied.", sources: [{ emailId: "insurance", highlights: ["please send the photographs and the date the damage was first reported."] }] },
  { id: "pending", text: "The inspection is not yet booked and the requested evidence is still to be gathered.", note: "Status inferred from these messages: the contractor awaits confirmation and the insurer requests evidence. Staff must check for any later booking or evidence before sending.", sources: [{ emailId: "quote", highlights: ["Please confirm before I book the visit."] }, { emailId: "insurance", highlights: ["please send the photographs and the date the damage was first reported."] }] },
];

const draftParagraphs = [
  "Hi Nadia,",
  draftEvidence[0].text,
  `${draftEvidence[1].text} ${draftEvidence[2].text}`,
  `${draftEvidence[3].text} We will check these points before confirming the next steps.`,
  "Kind regards,\nAmara",
];

export interface PropertyEmail {
  id: string;
  sender: string;
  initials: string;
  role: string;
  time: string;
  subject: string;
  body: string;
  category: string;
  tone: Tone;
  property: PropertyKey;
  owner: string;
  next: string;
  explanation: string;
  attachment?: string;
  draftFact?: string;
  propertyMatch?: { subject?: string; body: string; note: string };
}

interface ClientConfig {
  agency: string;
  initials: string;
  delivery: { welcome: string; panelBadge: string; panelNote: string; sourceLabel: string; explanation: string };
  properties: Record<PropertyKey, { name: string; flat: string; area: string }>;
  emails: PropertyEmail[];
  draftSubject: string;
  draftBody: string;
  draftEvidence: DraftEvidence[];
  draftParagraphs: string[];
  chapters: string[];
  storyFrames: { attention: AttentionTarget; annotation: string; step: number; seconds: number; upNext?: string; relatedCount?: number; contextEmailId?: string; evidenceId?: string; title?: string; caption?: string }[];
  walkthrough: { chapter: number; nextAction: string; label: string; title: string; explanation: string; change: string; seconds: number }[];
  reportHighlights: { text: string; step: number }[];
}

export const propertyDesk: ClientConfig = {
  agency: "Northline Lettings",
  initials: "NL",
  delivery: {
    welcome: "Normally, Motus organises emails and prepares drafts in the background. This walkthrough shows the process, including an optional sidebar add-on. Use Next whenever you’re ready.",
    panelBadge: "Optional add-on",
    panelNote: "Sidebar concept · installed separately. Automation works without this panel.",
    sourceLabel: "Motus · optional add-on concept",
    explanation: "The automation works in the background of your Gmail or Outlook inbox, organising emails and preparing drafts for your team to review. The sidebar shown here is an optional add-on, built and installed separately; its layout depends on your email platform. Your property system remains the record of truth.",
  },
  draftEvidence,
  draftParagraphs,
  chapters: ["Identify the email", "Find the context", "Prepare the reply"],
  storyFrames: [
    { attention: "report", annotation: "Start with the tenant’s report", upNext: "find the address", step: 0, seconds: 7 },
    { attention: "address", annotation: "Address found in the email", upNext: "property label", step: 1, seconds: 7, title: "Find the address.", caption: "Alder Court, Flat 2." },
    { attention: "property", annotation: "Property label suggested", upNext: "type of work", step: 1, seconds: 7, title: "Suggest the property label.", caption: "Keep this conversation with its property." },
    { attention: "issue", annotation: "Leak reported", upNext: "maintenance category", step: 2, seconds: 7, title: "Identify the problem.", caption: "Water through the ceiling." },
    { attention: "category", annotation: "Maintenance · staff review needed", upNext: "related emails", step: 2, seconds: 7, title: "Flag for maintenance.", caption: "Water near a light needs prompt review." },
    { attention: "related-leak", annotation: "Tenant report linked", upNext: "contractor quote", step: 3, seconds: 7, relatedCount: 1, title: "Start with the tenant’s report.", caption: "The report becomes the first message in this property’s context." },
    { attention: "related-quote", annotation: "Related quote found", upNext: "landlord message", step: 3, seconds: 7, relatedCount: 2, title: "A contractor has already replied.", caption: "His £285 inspection quote is brought alongside the tenant’s report." },
    { attention: "related-landlord", annotation: "Landlord needs an update", upNext: "insurer request", step: 3, seconds: 7, relatedCount: 3, title: "The landlord is waiting for an update.", caption: "Her message explains who needs a reply." },
    { attention: "related-insurance", annotation: "Possible match · check claim reference", upNext: "original quote", step: 3, seconds: 7, relatedCount: 4, title: "The insurer has asked for photographs.", caption: "This email names the building only. Staff must check its claim reference." },
    { attention: "quote", annotation: "£285 quoted · approval still needed", upNext: "landlord draft", step: 3, seconds: 7, relatedCount: 4, contextEmailId: "quote", title: "Here is the contractor’s original quote.", caption: "£285 for an inspection. He asks for confirmation before booking." },
    { attention: "draft", annotation: "Landlord draft prepared · nothing sent", upNext: "check the source", step: 4, seconds: 7, title: "The related facts become a draft.", caption: "A landlord update is prepared. Next, watch where its £285 figure comes from." },
    { attention: "source-quote", annotation: "Source: the contractor’s quoted price", upNext: "matching draft sentence", step: 4, seconds: 7, evidenceId: "quote", title: "First, check the original price.", caption: "The contractor quoted £285 and asked for approval before booking." },
    { attention: "draft-quote", annotation: "Same price · approval kept pending", upNext: "team review", step: 4, seconds: 7, evidenceId: "quote", title: "Now, see that fact in the draft.", caption: "The draft uses the same £285 figure without claiming the visit is booked." },
    { attention: "review", annotation: "Your team checks and approves", step: 5, seconds: 0, title: "The preparation is done. Your team reviews.", caption: "Property identified. Related mail gathered. Update drafted. Nothing sent." },
  ],
  reportHighlights: [
    { text: "Alder Court, Flat 2", step: 1 },
    { text: "Water is coming through the kitchen ceiling", step: 2 },
    { text: "The area around the light is wet.", step: 2 },
  ],
  walkthrough: [
    { chapter: 0, nextAction: "Find the property", label: "Read", title: "A tenant reports a leak.", explanation: "Talia reports water coming through her kitchen ceiling. We start with her original message before suggesting any action.", change: "The tenant email is open. Nothing has been labelled yet.", seconds: 9 },
    { chapter: 0, nextAction: "Identify the work", label: "Property", title: "The address suggests a property label.", explanation: "The message says ‘Alder Court, Flat 2’. That is why this property label is suggested.", change: "Alder Court, Flat 2 is highlighted in the email and its new label.", seconds: 9 },
    { chapter: 0, nextAction: "Show related emails", label: "Work type", title: "The leak is flagged as maintenance.", explanation: "‘Water coming through the kitchen ceiling’ makes this a maintenance request. Water near a light also needs prompt staff attention.", change: "Maintenance is added. The property label stays in place.", seconds: 11 },
    { chapter: 1, nextAction: "Prepare landlord update", label: "Related mail", title: "Four conversations. One property.", explanation: "The tenant, contractor and landlord name the property. The insurer names only the building, so its claim reference needs checking before staff rely on the match.", change: "Four email summaries appear together beside the original report.", seconds: 11 },
    { chapter: 2, nextAction: "Show review checkpoint", label: "Draft", title: "Those facts become a landlord draft.", explanation: "The draft uses the tenant report, the £285 quote and the request for photos. Unconfirmed actions stay clear.", change: "An unsent update is prepared from the related emails.", seconds: 13 },
    { chapter: 2, nextAction: "Explore the inbox", label: "Review", title: "Draft ready for your review. Nothing sent.", explanation: "A person checks the facts, approves any next steps and decides what to send. This demonstration stops before those decisions.", change: "The inspection and quote still need approval. A person stays in control.", seconds: 0 },
  ],
  properties: {
    alder: { name: "Alder Court", flat: "Flat 2", area: "Islington" },
    canal: { name: "Canal House", flat: "Flat 6", area: "Hoxton" },
    elm: { name: "Elm Row", flat: "Flat 1", area: "Highbury" },
  },
  emails: [
    {
      id: "leak", sender: "Talia Reed", initials: "TR", role: "Tenant", time: "09:08",
      draftFact: "Water through the ceiling; reported at 09:08.",
      propertyMatch: { body: "Alder Court, Flat 2", note: "The tenant names the building and flat in the message." },
      subject: "Water is coming through again",
      body: "Morning. Water is coming through the kitchen ceiling at Alder Court, Flat 2 again. The area around the light is wet. Please call me when you can.\n\nThanks,\nTalia",
      category: "Maintenance", tone: "rose", property: "alder", owner: "Amara Lewis",
      next: "Review tenant report and contractor quote",
      explanation: "Talia mentions water around a light. This needs prompt staff attention. An inspection has not been confirmed.",
    },
    {
      id: "quote", sender: "Owen Brooks", initials: "OB", role: "Contractor", time: "09:22",
      draftFact: "£285 inspection quote. Approval still needed.",
      propertyMatch: { subject: "Alder Court", body: "Flat 2", note: "The subject names Alder Court; the message identifies Flat 2." },
      subject: "Alder Court inspection quote",
      body: "Hi Amara,\n\nI can inspect the leak at Flat 2 this afternoon. The inspection quote is £285. Please confirm before I book the visit.\n\nBest,\nOwen",
      category: "Contractor quote", tone: "amber", property: "alder", owner: "Amara Lewis",
      next: "Review the £285 quote before booking",
      explanation: "The subject names Alder Court and the body mentions Flat 2. Check the property match; the contractor is waiting for approval.",
    },
    {
      id: "landlord", sender: "Nadia Ellis", initials: "NE", role: "Landlord", time: "09:34",
      draftFact: "Asks what has happened and what comes next.",
      propertyMatch: { subject: "Flat 2", body: "Alder Court", note: "The subject identifies Flat 2; the message names Alder Court." },
      subject: "Any update on Flat 2?",
      body: "Hi Amara,\n\nPlease let me know what has happened with the leak at Alder Court and what the next step is.\n\nThank you,\nNadia",
      category: "Landlord update", tone: "blue", property: "alder", owner: "Amara Lewis",
      next: "Prepare an update from the related emails",
      explanation: "The landlord is asking for an update on the same property. Keep confirmed facts separate from actions still pending.",
    },
    {
      id: "viewing", sender: "Luca Morgan", initials: "LM", role: "Prospective tenant", time: "09:47",
      subject: "Viewing Canal House",
      body: "Hello,\n\nIs Flat 6 at Canal House still available? I would like to see it this week.\n\nMany thanks,\nLuca",
      category: "Viewing enquiry", tone: "green", property: "canal", owner: "Ben Patel",
      next: "Check viewing criteria and availability",
      explanation: "Collect the agency’s required viewing information before offering a visit. Staff can then choose whether to share the property video.",
    },
    {
      id: "invoice", sender: "Elm Services", initials: "ES", role: "Supplier", time: "10:03",
      subject: "Invoice ES-204",
      body: "Good morning,\n\nPlease find our invoice ES-204 for the work at Elm Row, Flat 1. Let us know if you need anything else.\n\nElm Services",
      category: "Invoice", tone: "violet", property: "elm", owner: "Finance team",
      next: "Check the invoice against the property record",
      explanation: "The email does not state an amount or payment status. Finance needs to check the actual invoice and ledger before recording anything.",
      attachment: "Invoice ES-204 · mentioned in email",
    },
    {
      id: "service", sender: "Crescent Management", initials: "CM", role: "Managing agent", time: "10:07",
      subject: "Elm Row service charge demand",
      body: "Good morning,\n\nThe service charge demand for Elm Row, Flat 1 is attached. Please arrange payment and quote the property reference.\n\nKind regards,\nCrescent Management",
      category: "Service charge", tone: "violet", property: "elm", owner: "Finance team",
      next: "Check the ledger, then ask the landlord",
      explanation: "Staff must check the property-system record and ask the landlord whether to provide funds or account for the charge on their ledger.",
      attachment: "Service charge demand · mentioned in email",
    },
    {
      id: "insurance", sender: "Northstar Claims", initials: "NC", role: "Insurer", time: "10:11",
      draftFact: "Requests photos and the first report date.",
      propertyMatch: { body: "Alder Court", note: "The building is named, but the flat is not. Staff must check the claim reference against the property record." },
      subject: "Claim NC-417: requested photos",
      body: "Hello,\n\nFor the Alder Court leak case, please send the photographs and the date the damage was first reported.\n\nKind regards,\nNorthstar Claims",
      category: "Insurance", tone: "amber", property: "alder", owner: "Amara Lewis",
      next: "Gather the requested photographs",
      explanation: "The insurer has requested evidence. The photographs are not in these messages, and the claim has not been approved.",
    },
  ],
  draftSubject: "Alder Court, Flat 2 — leak update",
  draftBody: draftParagraphs.join("\n\n"),
};
