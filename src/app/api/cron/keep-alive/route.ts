import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// Keep the Supabase free-tier database from auto-pausing after 7 days of
// inactivity. Vercel Cron calls this once a day (see vercel.json), which
// registers real database activity and resets the idle timer.

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  // When CRON_SECRET is set, Vercel Cron sends it as a Bearer token.
  // Reject anything else so the endpoint can't be triggered publicly.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authorization = request.headers.get("authorization");
    if (authorization !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, at: new Date().toISOString() });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
