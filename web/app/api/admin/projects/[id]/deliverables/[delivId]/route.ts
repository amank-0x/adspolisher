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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; delivId: string }> }
) {
  try {
    const { id, delivId } = await params;
    const body = await req.json();

    const response = await backendFetch(`${API_BASE}/api/v1/projects/${id}/deliverables/${delivId}`, {
      method: "PATCH",
      headers: authHeaders(req),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[API /api/admin/projects/[id]/deliverables/[delivId] PATCH error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to update deliverable.", error: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; delivId: string }> }
) {
  try {
    const { id, delivId } = await params;

    const response = await backendFetch(`${API_BASE}/api/v1/projects/${id}/deliverables/${delivId}`, {
      method: "DELETE",
      headers: authHeaders(req),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[API /api/admin/projects/[id]/deliverables/[delivId] DELETE error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete deliverable.", error: error?.message },
      { status: 500 }
    );
  }
}
