import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
    newUser: '/signup'
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnLoginPage = nextUrl.pathname.startsWith('/login')
      const isOnSignupPage = nextUrl.pathname.startsWith('/signup')

      // Add this section to define protected routes
      const protectedRoutes = ['/new', '/profile', '/results']
      const isOnProtectedRoute = protectedRoutes.some(route =>
        nextUrl.pathname.startsWith(route)
      )

      if (isLoggedIn) {
        if (isOnLoginPage || isOnSignupPage) {
          return Response.redirect(new URL('/', nextUrl))
        }
        // Allow access to protected routes for logged-in users
        return true
      } else if (isOnProtectedRoute) {
        // Redirect to login page if trying to access protected route while not logged in
        return Response.redirect(new URL('/login', nextUrl))
      }

      // Allow access to public routes for everyone
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, id: user.id }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        const { id } = token as { id: string }
        const { user } = session

        session = { ...session, user: { ...user, id } }
      }

      return session
    }
  },
  providers: []
} satisfies NextAuthConfig
