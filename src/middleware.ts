import type { auth } from "@/lib/auth";
import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";
import { getApprovalStatus } from "./server/actions/getApprovalStatus";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
      },
    }
  );
  const url = request.nextUrl;
  const isLoggedIn = !!session;
  const isLoginPage = url.pathname.includes("/login");
  const isRegisterPage = url.pathname.includes("/register");

  // If user is logged in and tries to access login or register page, redirect to dashboard
  if (isLoggedIn && (isLoginPage || isRegisterPage)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is not logged in and not on login or register page, redirect to login
  if (!session && !(isLoginPage || isRegisterPage)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Skip email verification check for non-authenticated users
  if (!session) {
    return NextResponse.next();
  }

  const isPendingApprovalPage = url.pathname.includes("/pending_approval");
  const isEmailVerified = await getApprovalStatus(session?.user.id);
  // Redirect users with unverified emails to the pending approval page
  if (isLoggedIn && !isEmailVerified && !isPendingApprovalPage) {
    return NextResponse.redirect(new URL("/pending_approval", request.url));
  }

  // Redirect users with verified emails away from the pending approval page
  if (isLoggedIn && isEmailVerified && isPendingApprovalPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Add matcher config to exclude static files and API routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)"],
};
