import { NextResponse } from 'next/server';

// Client-side navigations fetch page props from /_next/data/<buildId>/api/....json.
// Vercel's routing applies the /api/:path* -> /ipa/:path* rewrite from
// next.config.mjs to those requests but loses the data-request context and
// serves the page HTML instead of the props JSON
// (https://github.com/vercel/next.js/issues/39669), so the router never
// receives pageProps. Proxy rewrites keep data-request semantics, so map
// /api/* to /ipa/* here for data requests only; regular page requests fall
// through to the config rewrites, and the /ipa -> /api canonical redirect
// is unchanged.
function rewriteApiDataRequest(req) {
    const isDataRequest =
        req.headers.get('x-nextjs-data') !== null ||
        req.nextUrl.pathname.startsWith('/_next/data/');
    if (!isDataRequest) return null;

    const url = req.nextUrl.clone();
    if (url.pathname.startsWith('/_next/data/')) {
        // Raw data-request path, in case the runtime matches it un-normalized.
        // Bare api.json maps to ipa/introduction.json to mirror the /api ->
        // /ipa/introduction rewrite; there is no /ipa index page.
        url.pathname = url.pathname
            .replace(
                /^(\/_next\/data\/[^/]+)\/api\.json$/,
                '$1/ipa/introduction.json',
            )
            .replace(/^(\/_next\/data\/[^/]+)\/api\//, '$1/ipa/');
    } else if (url.pathname === '/api') {
        url.pathname = '/ipa/introduction';
    } else if (url.pathname.startsWith('/api/')) {
        url.pathname = url.pathname.replace(/^\/api\//, '/ipa/');
    }

    if (url.pathname === req.nextUrl.pathname) return null;
    return NextResponse.rewrite(url);
}

export function proxy(req) {
    if (req.nextUrl.href.includes('/docs-static/_next/'))
        return NextResponse.rewrite(
            req.nextUrl.href.replace('/docs-static/_next/', '/_next/'),
        );

    return rewriteApiDataRequest(req);
}
