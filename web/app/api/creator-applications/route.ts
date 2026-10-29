import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Spam honeypot detection
    const honeypot = formData.get("user_confirm_token");
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Application received" });
    }

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const location = formData.get("location")?.toString().trim();
    const portfolioUrl = formData.get("portfolioUrl")?.toString().trim();
    const secondaryUrl = formData.get("secondaryUrl")?.toString().trim() || "";
    const craftSpecialty = formData.get("craftSpecialty")?.toString() || "";
    const primaryTools = formData.get("primaryTools")?.toString() || "";
    const experienceLevel = formData.get("experienceLevel")?.toString() || "";
    const weeklyAvailability = formData.get("weeklyAvailability")?.toString() || "";
    const notes = formData.get("notes")?.toString().trim() || "";

    // Required fields check
    if (
      !name ||
      !email ||
      !location ||
      !portfolioUrl ||
      !craftSpecialty ||
      !primaryTools ||
      !experienceLevel ||
      !weeklyAvailability
    ) {
      return NextResponse.json(
        { error: "Missing required application fields" },
        { status: 400 }
      );
    }

    const files = formData.getAll("files") as File[];
    const fileSummaries = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    // Log the received application
    console.log("[CREATOR APPLICATION RECEIVED - /become-a-creator]", {
      name,
      email,
      location,
      portfolioUrl,
      secondaryUrl,
      craftSpecialty,
      primaryTools,
      experienceLevel,
      weeklyAvailability,
      notesLength: notes.length,
      filesCount: files.length,
      fileSummaries,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Creator application submitted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error("[CREATOR APPLICATION ERROR]", err);
    return NextResponse.json(
      { error: "Internal server error submitting creator application" },
      { status: 500 }
    );
  }
}
