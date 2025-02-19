// src/app/api/room/route.ts
import { NextResponse, NextRequest } from 'next/server';

export function GET(request: NextRequest) {
  const idStanza = request.cookies.get('idStanza')?.value;
  return NextResponse.json({ idStanza });
}
