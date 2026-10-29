import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const endpoint = `${API_BASE}/api/v1/requests/all${queryString ? `?${queryString}` : ""}`;

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
    console.error("[API /api/admin/requests GET error]", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch admin requests",
        error: err?.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, internalNotes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "ID and status are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE}/api/v1/requests/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
        authorization: req.headers.get("authorization") || "",
      },
      body: JSON.stringify({ status, internalNotes }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("[API /api/admin/requests PATCH error]", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update request status",
        error: err?.message,
      },
      { status: 500 }
    );
  }
}
