import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-api";

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
    const endpoint = `${API_BASE}/api/v1/services${queryString ? `?${queryString}` : "?all=true"}`;

    const response = await backendFetch(endpoint, {
      headers: authHeaders(req),
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("[API /api/admin/services GET error]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch services.", error: err?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await backendFetch(`${API_BASE}/api/v1/services`, {
      method: "POST",
      headers: authHeaders(req),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("[API /api/admin/services POST error]", err);
    return NextResponse.json(
      { success: false, message: "Failed to create service.", error: err?.message },
      { status: 500 }
    );
  }
}
