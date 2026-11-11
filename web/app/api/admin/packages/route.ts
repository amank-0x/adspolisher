import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function authHeaders(req: Request) {
  return {
    "Content-Type": "application/json",
    cookie: req.headers.get("cookie") || "",
    authorization: req.headers.get("authorization") || "",
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const endpoint = `${API_BASE}/api/v1/packages${queryString ? `?${queryString}` : "?all=true"}`;

    const response = await fetch(endpoint, {
      headers: authHeaders(req),
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("[API /api/admin/packages GET error]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch packages.", error: err?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await fetch(`${API_BASE}/api/v1/packages`, {
      method: "POST",
      headers: authHeaders(req),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("[API /api/admin/packages POST error]", err);
    return NextResponse.json(
      { success: false, message: "Failed to create package.", error: err?.message },
      { status: 500 }
    );
  }
}
