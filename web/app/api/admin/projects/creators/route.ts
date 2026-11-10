import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET(req: Request) {
  try {
    const endpoint = `${API_BASE}/api/v1/projects/creators`;

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
    console.error("[API /api/admin/projects/creators GET error]", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch creators",
        error: err?.message,
      },
      { status: 500 }
    );
  }
}
