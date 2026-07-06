import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return fail(error.issues.map((issue) => issue.message).join("; "), 422);
  }

  if (error instanceof Error) {
    return fail(error.message, 400);
  }

  return fail("Unexpected error", 500);
}

export function requireAdmin(request: Request) {
  const expected = process.env.ADMIN_TOKEN;
  const received = request.headers.get("x-admin-token");

  if (!expected || received !== expected) {
    return fail("Unauthorized", 401);
  }

  return null;
}
