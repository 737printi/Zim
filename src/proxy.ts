import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname.startsWith('/recuperar-senha')
  const isProtected = request.nextUrl.pathname.startsWith('/membro') || request.nextUrl.pathname.startsWith('/admin')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  // We need to fetch the profile to check role and kiwify status if user is logged in
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role, kiwify_status')
      .eq('id', user.id)
      .single()
    profile = data
  }

  // If visiting root, redirect based on auth and role
  if (request.nextUrl.pathname === '/') {
    if (user) {
      if (profile?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.redirect(new URL('/membro', request.url))
    }
    // If not logged in, just let them see the Landing Page
  }

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    if (profile?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.redirect(new URL('/membro', request.url))
  }

  // Check roles and kiwify status
  if (user && isProtected && profile) {
    if (isAdminRoute && profile.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/membro' // Redirect students away from admin
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/membro/:path*',
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
