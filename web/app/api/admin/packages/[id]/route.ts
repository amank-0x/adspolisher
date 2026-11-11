import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function authHeaders(req: Request) {
  return {
    "Content-Type": "application/json",
    cookie: req.headers.get("cookie") || "",
    authorization: req.headers.get("authorization") || "",
  };
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await fetch(`${API_BASE}/api/v1/packages/${id}`, {
      headers: authHeaders(req),
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("[API /api/admin/packages/[id] GET error]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch package.", error: err?.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const response = await fetch(`${API_BASE}/api/v1/packages/${id}`, {
      method: "PATCH",
      headers: authHeaders(req),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("[API /api/admin/packages/[id] PATCH error]", err);
    return NextResponse.json(
      { success: false, message: "Failed to update package.", error: err?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await fetch(`${API_BASE}/api/v1/packages/${id}`, {
      method: "DELETE",
      headers: authHeaders(req),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("[API /api/admin/packages/[id] DELETE error]", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete package.", error: err?.message },
      { status: 500 }
    );
  }
}
