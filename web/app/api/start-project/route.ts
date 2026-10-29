import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Spam honeypot detection
    const honeypot = formData.get("website_confirm");
    if (honeypot) {
      // Silently discard spam
      return NextResponse.json({ success: true, message: "Inquiry received" });
    }

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const companyName = formData.get("companyName")?.toString().trim();
    const website = formData.get("website")?.toString().trim() || "";
    const referralSource = formData.get("referralSource")?.toString() || "";
    const serviceNeeded = formData.get("serviceNeeded")?.toString() || "";
    const projectSize = formData.get("projectSize")?.toString() || "";
    const targetTimeline = formData.get("targetTimeline")?.toString() || "";
    const budgetRange = formData.get("budgetRange")?.toString() || "";
    const contentReadiness = formData.get("contentReadiness")?.toString() || "";
    const additionalNotes = formData.get("additionalNotes")?.toString().trim() || "";

    // Required fields check
    if (
      !name ||
      !email ||
      !companyName ||
      !referralSource ||
      !serviceNeeded ||
      !projectSize ||
      !targetTimeline ||
      !budgetRange ||
      !contentReadiness
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Process files
    const files = formData.getAll("files") as File[];
    const fileSummaries = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    const projectTitle = `${companyName} - ${serviceNeeded}`;
    const formattedMessage = `[Project: ${projectTitle}]

Service: ${serviceNeeded}
Project Scope / Deliverables: ${projectSize}
Content Readiness: ${contentReadiness}
Target Timeline: ${targetTimeline}
Referral Source: ${referralSource}

${additionalNotes ? `Client Notes:\n${additionalNotes}` : "Inquiry submitted via AdsPolisher /start-project landing page."}`;

    const payload = {
      name,
      email,
      companyName,
      companyWebsite: website || null,
      projectTitle,
      serviceNeeded,
      goals: `Timeline: ${targetTimeline} · Scope: ${projectSize} · Readiness: ${contentReadiness}`,
      budgetRange,
      message: formattedMessage,
      source: "LANDING_PAGE",
      attachments: {
        projectTitle,
        serviceNeeded,
        projectSize,
        targetTimeline,
        contentReadiness,
        referralSource,
        fileSummaries,
        source: "LANDING_PAGE",
        submittedAt: new Date().toISOString(),
      },
    };

    // Forward to Express API server to persist in Neon PostgreSQL
    const backendRes = await fetch(`${API_BASE}/api/v1/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
        authorization: req.headers.get("authorization") || "",
      },
      body: JSON.stringify(payload),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      console.error("[START-PROJECT DB SAVE FAILED]", data);
      return NextResponse.json(
        { error: data.message || "Failed to save project request" },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project request submitted and saved to database successfully",
      data: data.data,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error("[INQUIRY ERROR]", err);
    return NextResponse.json(
      { error: "Internal server error submitting project request" },
      { status: 500 }
    );
  }
}
