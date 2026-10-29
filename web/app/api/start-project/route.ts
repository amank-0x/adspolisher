import { NextResponse } from "next/server";

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

    // Log the intake inquiry
    console.log("[INQUIRY RECEIVED - /start-project]", {
      name,
      email,
      companyName,
      website,
      referralSource,
      serviceNeeded,
      projectSize,
      targetTimeline,
      budgetRange,
      contentReadiness,
      additionalNotesLength: additionalNotes.length,
      filesCount: files.length,
      fileSummaries,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Project request submitted successfully",
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
