import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE, createAdminSessionValue } from "@/lib/adminAuth";
import { fail, handleApiError, ok } from "@/lib/http";

const sessionSchema = z.object({
  token: z.string().min(1)
});

export async function POST(request: Request) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    return fail("ADMIN_TOKEN is not configured", 503);
  }

  try {
    const body = sessionSchema.parse(await request.json());
    if (body.token !== expected) {
      return fail("Invalid admin token", 401);
    }

    const sessionValue = await createAdminSessionValue(expected);
    const response = ok({ authenticated: true });
    response.cookies.set(ADMIN_COOKIE, sessionValue, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true, data: { authenticated: false } });
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
  return response;
}
