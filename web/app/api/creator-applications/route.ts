import { NextResponse } from "next/server";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");

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

    const response = await fetch(`${apiBaseUrl}/api/v1/creator-applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
        authorization: req.headers.get("authorization") || "",
      },
      body: JSON.stringify({
        name,
        email,
        location,
        portfolioUrl,
        secondaryUrl,
        craftSpecialty,
        primaryTools,
        experienceLevel,
        weeklyAvailability,
        notes,
        fileSummaries,
      }),
    });

    const data = await response.json().catch(() => ({
      success: false,
      message: "Unexpected response from the application service.",
    }));

    return NextResponse.json(data, { status: response.status });
  } catch (err: unknown) {
    console.error("[CREATOR APPLICATION ERROR]", err);
    return NextResponse.json(
      { error: "Internal server error submitting creator application" },
      { status: 500 }
    );
  }
}
