import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

/**
 * Auth with a fallback.
 *
 * If AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET are set, CineSeat uses real Google
 * OAuth. If they are not (the classroom default), it falls back to a one-click
 * demo provider so booking and ReelBot cancel are not blocked on Cloud Console.
 *
 * That fallback is development scaffolding, not a feature.
 */
const googleConfigured = Boolean(
  process.env.AUTH_GOOGLE_ID?.trim() && process.env.AUTH_GOOGLE_SECRET?.trim(),
);

export const AUTH_PROVIDER_ID = googleConfigured ? "google" : "demo";

if (!googleConfigured) {
  console.warn(
    "[auth] No Google credentials found - using the demo sign-in provider. " +
      "Never deploy this to real customers.",
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? "cineseat-dev-only-secret-change-me",
  trustHost: true,
  session: { strategy: "jwt" },
  providers: googleConfigured
    ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID!,
          clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
      ]
    : [
        Credentials({
          id: "demo",
          name: "Demo sign-in",
          credentials: {},
          authorize: async () => ({
            id: "demo-user",
            name: "Demo Customer",
            email: "demo@cineseat.test",
          }),
        }),
      ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        if (typeof token.email === "string") session.user.email = token.email;
        if (typeof token.name === "string") session.user.name = token.name;
      }
      return session;
    },
  },
});
