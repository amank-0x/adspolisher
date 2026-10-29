import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET(req: Request) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/requests/admin/overview`, {
      headers: {
        cookie: req.headers.get("cookie") || "",
        authorization: req.headers.get("authorization") || "",
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("[API /api/admin/overview GET error]", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch admin overview data",
        error: err?.message,
      },
      { status: 500 }
    );
  }
}
