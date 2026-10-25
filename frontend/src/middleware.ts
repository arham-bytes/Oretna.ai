import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Completely restrict /workspace access during pre-launch
  if (pathname.startsWith('/workspace')) {
    const sessionToken =
      request.cookies.get('oretna_session')?.value ||
      request.cookies.get('kaetle_session')?.value;

    if (!sessionToken) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', '/onboarding/survey');
      return NextResponse.redirect(redirectUrl);
    }

    // Nobody can access the chatbox during pre-launch
    return NextResponse.redirect(new URL('/onboarding/thank-you', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/workspace/:path*', '/workspace'],
};
