import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const session = req.auth
  const isLoggedIn = !!session
  const pathname = req.nextUrl.pathname

  const isOnDashboard = pathname.startsWith("/dashboard")
  const isOnLogin = pathname.startsWith("/login")
  const isOnAnalytics = pathname.startsWith("/analytics")
  const role = session?.user.role

  if (!isLoggedIn && (isOnDashboard || isOnAnalytics)) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if (isOnAnalytics && role !== 'admin') {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
})

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/analytics/:path*"]
}