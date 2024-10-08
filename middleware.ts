import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/properties(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware((auth, req) => {
  const isAdmin = auth().userId === process.env.ADMIN_USER_ID;

  // if the user is not an admin and is trying to access the admin route, redirect to the home page
  if (isAdminRoute(req) && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
