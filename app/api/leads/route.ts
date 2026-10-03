import { getCloudflareContext } from "@opennextjs/cloudflare";

type LeadPayload = {
  fullName?: unknown;
  businessName?: unknown;
  email?: unknown;
  outcome?: unknown;
  headache?: unknown;
  investment?: unknown;
  existing?: unknown;
  websiteUrl?: unknown;
  website?: unknown;
  system?: unknown;
};

type LeadEnvironment = CloudflareEnv & {
  LEAD_RATE_LIMITER?: {
    limit: (input: { key: string }) => Promise<{ success: boolean }>;
  };
  N8N_LEAD_WEBHOOK_TOKEN?: string;
  N8N_LEAD_WEBHOOK_URL?: string;
};

const MAX_BODY_BYTES = 16_384;
const allowedSystemInterests = new Set([
  "Sector-specific demonstration",
  "Ledger Desk — Accountancy and bookkeeping — Unpaid Invoice Control",
]);

const isText = (value: unknown, maxLength: number) =>
  typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;

const isOptionalPublicUrl = (value: unknown) => {
  if (value === undefined || value === "") return true;
  if (typeof value !== "string" || value.length > 500) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

const isAllowedSystemInterest = (value: unknown) =>
  value === undefined || value === "" ||
  (typeof value === "string" && allowedSystemInterests.has(value.trim()));

export async function POST(request: Request) {
  let payload: LeadPayload;
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  const declaredLength = Number(request.headers.get("content-length") ?? "0");

  if (!contentType.startsWith("application/json")) {
    return Response.json({ message: "JSON is required." }, { status: 415 });
  }

  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return Response.json({ message: "Request is too large." }, { status: 413 });
  }

  try {
    const body = await request.text();

    if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) {
      return Response.json({ message: "Request is too large." }, { status: 413 });
    }

    payload = JSON.parse(body) as LeadPayload;
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }

  if (typeof payload.website === "string" && payload.website.trim()) {
    return Response.json({ message: "Request received." });
  }

  if (
    !isText(payload.fullName, 100) ||
    !isText(payload.businessName, 160) ||
    !isText(payload.email, 200) ||
    !isText(payload.outcome, 120) ||
    !isText(payload.headache, 1200) ||
    !isText(payload.investment, 80) ||
    !isText(payload.existing, 300) ||
    !isOptionalPublicUrl(payload.websiteUrl) ||
    !isAllowedSystemInterest(payload.system) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email))
  ) {
    return Response.json({ message: "Please complete every field." }, { status: 400 });
  }

  const { env } = await getCloudflareContext({ async: true });
  const leadEnvironment = env as LeadEnvironment;
  const clientAddress =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (leadEnvironment.LEAD_RATE_LIMITER) {
    const rateLimit = await leadEnvironment.LEAD_RATE_LIMITER.limit({
      key: `website-lead:${clientAddress}`,
    });

    if (!rateLimit.success) {
      return Response.json(
        { message: "Too many requests. Please try again shortly." },
        { status: 429 },
      );
    }
  }

  const webhookUrl =
    leadEnvironment.N8N_LEAD_WEBHOOK_URL ?? process.env.N8N_LEAD_WEBHOOK_URL;
  const webhookToken =
    leadEnvironment.N8N_LEAD_WEBHOOK_TOKEN ?? process.env.N8N_LEAD_WEBHOOK_TOKEN;

  if (!webhookUrl || !webhookToken) {
    return Response.json({ message: "Lead capture is not configured." }, { status: 503 });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Motus-Webhook-Token": webhookToken,
      },
      body: JSON.stringify({
        full_name: String(payload.fullName).trim(),
        business_name: String(payload.businessName).trim(),
        email: String(payload.email).trim(),
        outcome_needed: String(payload.outcome).trim(),
        headache: String(payload.headache).trim(),
        investment_range: String(payload.investment).trim(),
        existing_systems: String(payload.existing).trim(),
        public_website_url: typeof payload.websiteUrl === "string" ? payload.websiteUrl.trim() : "",
        system_interest: typeof payload.system === "string" ? payload.system.trim() : "",
        source: "motus-website",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return Response.json({ message: "Lead capture is unavailable." }, { status: 502 });
    }

    return Response.json({ message: "Request received." });
  } catch {
    return Response.json({ message: "Lead capture is unavailable." }, { status: 502 });
  }
}
