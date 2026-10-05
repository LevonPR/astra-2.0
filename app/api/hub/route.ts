import { NextResponse } from "next/server";
import { hubSnapshot } from "../../../lib/hub";

export function GET() {
  return NextResponse.json(hubSnapshot());
}
