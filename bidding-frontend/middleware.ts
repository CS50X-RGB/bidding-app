import { NextRequest, NextResponse } from "next/server";

function pathMatches(pathname: string, allowedLinks: string[]): boolean {

  for (const pattern of allowedLinks) {

    if (pattern === pathname) {
      return true;
    }
    if (pattern.includes("[")) {
      const regexPattern = pattern.replace(/\[.*?\]/g, "[^/]+");
      const regex = new RegExp('^${regexPattern}$');
      if (regex.test(pathname)) {

        console.log("pathname :", pathname);
        console.log('regex: ', regex);


        return true;
      }
    }


    if (pathname.startsWith(pattern + "/")) {
      const remainingPath = pathname.slice(pattern.length + 1); // remove "/"
      const segments = remainingPath.split("/");

      // Check that the last segment is a valid ObjectId
      const lastSegment = segments[segments.length - 1];
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(lastSegment);

      if (segments.length === 1 && isValidObjectId) {
        console.log('remaining Path:', remainingPath);
        console.log('segments:', segments);
        console.log('Pattern:', pattern);
        return true;
      }
    }

  }


  return false;
}





export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = request.cookies.get("nextToken")?.value;
  const role = request.cookies.get("userRole")?.value;
  const allowedLinks = JSON.parse(request.cookies.get("allowedLinks")?.value || "[]");
  if (pathname === "/" || pathname == "/login") {
    return NextResponse.next();
  }
  if (token && role) {
    console.log(pathname, "Pathname");
    const isAllowed = pathMatches(pathname, allowedLinks);
    if (!isAllowed) {
      const url = request.nextUrl.clone();
      url.pathname = "/not-allowed";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|not-allowed).*)"]
};