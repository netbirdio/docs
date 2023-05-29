import { NextRequest, NextResponse } from 'next/server';

export function middleware(req) {
    if (req.nextUrl.href.includes('/docs-static/_next/'))
        return NextResponse.rewrite(
            req.nextUrl.href.replace('/docs-static/_next/', '/_next/'),
        );

    return null;
}