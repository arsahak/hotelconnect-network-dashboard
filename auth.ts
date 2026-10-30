import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { isUserRole } from "@/config/access";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const AUTH_SECRET =
  process.env.DASHBOARD_AUTH_SECRET ??
  (process.env.AUTH_SECRET ? `dashboard:${process.env.AUTH_SECRET}` : undefined);

/** The account exists but has been switched off by an admin. */
export class InactiveAccountError extends CredentialsSignin {
  code = "inactive";
}

/**
 * Admins: the password was right, now the emailed code is needed (briefing §7).
 * The code carries the challenge back to the sign-in page: "two_factor:<challenge>:<masked email>".
 */
export class TwoFactorRequiredError extends CredentialsSignin {
  constructor(challenge: string, email: string) {
    super();
    this.code = `two_factor:${challenge}:${email}`;
  }
}

/** The second step's code was wrong or expired. */
export class InvalidCodeError extends CredentialsSignin {
  code = "invalid_code";
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  secret: AUTH_SECRET,
  // Own cookie names, so the dashboard session never mixes with the website
  // when both run on localhost.
  cookies: {
    sessionToken: { name: "hotelconnect-dashboard.session-token" },
    callbackUrl: { name: "hotelconnect-dashboard.callback-url" },
    csrfToken: { name: "hotelconnect-dashboard.csrf-token" },
    pkceCodeVerifier: { name: "hotelconnect-dashboard.pkce.code-verifier" },
    state: { name: "hotelconnect-dashboard.state" },
    nonce: { name: "hotelconnect-dashboard.nonce" },
    webauthnChallenge: { name: "hotelconnect-dashboard.challenge" },
  },
  providers: [
    // One sign-in for admins, hotel managers, hotel staff and suppliers —
    // hits the backend's /api/v1/auth/signin. The role decides the menu.
    Credentials({
      id: "credentials",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        challenge: { type: "hidden" },
        code: { type: "text" },
      },
      async authorize(credentials) {
        // Step 2 for admins: the emailed code. Step 1 for everyone: email + password.
        const secondStep = Boolean(credentials?.challenge && credentials?.code);
        if (!secondStep && (!credentials?.email || !credentials?.password)) return null;

        const res = await fetch(`${BACKEND_URL}/api/v1/auth/${secondStep ? "2fa/verify" : "signin"}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            secondStep
              ? { challenge: credentials.challenge, code: credentials.code }
              : { email: credentials.email, password: credentials.password },
          ),
          cache: "no-store",
          // The hosted API can take a few seconds on its first request after
          // being idle (cold start + database connect).
          signal: AbortSignal.timeout(15000),
        }).catch((error) => {
          console.error("Sign-in request failed:", error);
          return null;
        });

        if (!res) return null;
        if (res.status === 403) throw new InactiveAccountError();
        if (!res.ok) {
          if (secondStep) throw new InvalidCodeError();
          return null;
        }

        const body = await res.json();
        if (body?.data?.twoFactorRequired) throw new TwoFactorRequiredError(body.data.challenge, body.data.email ?? "");
        const user = body?.data?.user;
        const token = body?.data?.token;

        if (!token || !user?._id || !isUserRole(user.role)) {
          console.error("Sign-in response is missing fields or has an unknown role");
          return null;
        }

        return {
          id: user._id,
          email: user.email ?? null,
          name: `${user.firstName} ${user.lastName ?? ""}`.trim(),
          accessToken: token,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.accessToken = token.accessToken;
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  session: {
    strategy: "jwt",
    // Same lifetime as the backend access token.
    maxAge: 7 * 24 * 60 * 60,
  },
});
