import { NextRequest, NextResponse } from "next/server";
import { Locale } from "@/lib/i18n/translations";

export async function POST(request: NextRequest) {
  try {
    const { locale } = await request.json();

    // Validate locale
    if (locale !== "fr" && locale !== "ar") {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });

    // Set cookie
    response.cookies.set({
      name: "locale",
      value: locale as Locale,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
