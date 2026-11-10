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
    const response = await fetch(`${API_BASE}/api/v1/projects/roster/creators`, {
      headers: authHeaders(req),
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[API /api/admin/team/roster GET error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch creator roster.", error: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(`${API_BASE}/api/v1/projects/roster/creators`, {
      method: "POST",
      headers: authHeaders(req),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[API /api/admin/team/roster POST error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to add creator to roster.", error: error?.message },
      { status: 500 }
    );
  }
}
