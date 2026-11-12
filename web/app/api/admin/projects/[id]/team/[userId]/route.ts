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
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const { id, userId } = await params;
    const body = await req.json();

    const response = await backendFetch(`${API_BASE}/api/v1/projects/${id}/team/${userId}`, {
      method: "PATCH",
      headers: authHeaders(req),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[API /api/admin/projects/[id]/team/[userId] PATCH error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to update team member role.", error: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const { id, userId } = await params;

    const response = await backendFetch(`${API_BASE}/api/v1/projects/${id}/team/${userId}`, {
      method: "DELETE",
      headers: authHeaders(req),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[API /api/admin/projects/[id]/team/[userId] DELETE error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove member from team.", error: error?.message },
      { status: 500 }
    );
  }
}
