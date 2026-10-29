import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Forward to Express backend with incoming cookies and headers
    const response = await fetch(`${API_BASE}/api/v1/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
        authorization: req.headers.get("authorization") || "",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("[API /api/requests POST error]", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to request service",
        error: err?.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const endpoint = `${API_BASE}/api/v1/requests/my${queryString ? `?${queryString}` : ""}`;

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
    console.error("[API /api/requests GET error]", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch project requests",
        error: err?.message,
      },
      { status: 500 }
    );
  }
}
