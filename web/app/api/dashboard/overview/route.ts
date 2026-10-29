import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const endpoint = `${API_BASE}/api/v1/requests/client/overview${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(endpoint, {
      headers: {
        cookie: req.headers.get("cookie") || "",
        authorization: req.headers.get("authorization") || "",
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("[API /api/dashboard/overview GET error]", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch client overview data",
        error: err?.message,
      },
      { status: 500 }
    );
  }
}
