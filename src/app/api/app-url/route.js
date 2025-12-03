import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXTAUTH_URL || 'https://pash.club';
  return NextResponse.json({ url });
}