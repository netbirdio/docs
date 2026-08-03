import { NextResponse } from 'next/server'

// Client-side navigations fetch page props from /_next/data/<buildId>/api/....json.
// Vercel's routing applies the /api/:path* -> /ipa/:path* rewrite from
// next.config.mjs to those requests but loses the data-request context and
// serves the page HTML instead of the props JSON, so the router never receives
// pageProps (https://github.com/vercel/next.js/issues/39669). Middleware
// rewrites keep data-request semantics, so map /api/* to /ipa/* here for data
// requests only; regular page requests fall through to the config rewrites.
export const config = {
  matcher: [
    '/api/:path*',
    // Raw data-request paths, in case the runtime matches them un-normalized.
    '/_next/data/:build/api.json',
    '/_next/data/:build/api/:path*',
  ],
}

export function middleware(request) {
  const isDataRequest =
    request.headers.get('x-nextjs-data') !== null ||
    request.nextUrl.pathname.startsWith('/_next/data/')
  if (!isDataRequest) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  if (url.pathname.startsWith('/_next/data/')) {
    url.pathname = url.pathname.replace(
      /^(\/_next\/data\/[^/]+)\/api(\/|\.json$)/,
      '$1/ipa$2'
    )
  } else if (url.pathname === '/api') {
    url.pathname = '/ipa/introduction'
  } else {
    url.pathname = url.pathname.replace(/^\/api\//, '/ipa/')
  }

  if (url.pathname === request.nextUrl.pathname) {
    return NextResponse.next()
  }
  return NextResponse.rewrite(url)
}
