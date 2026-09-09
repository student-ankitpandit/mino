import express from "express"
import { prisma } from "db/client"
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in the .env")
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ""

const getOAuthClient = (req: express.Request) => {
  const host = req.get("host") || "";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  const protocol =
    req.protocol === "https" || req.get("x-forwarded-proto") === "https"
      ? "https"
      : isLocal
      ? "http"
      : "https";
  const defaultBackend = isLocal
    ? `${protocol}://${host}`
    : "https://mino-be.onrender.com";
  const backendBase = process.env.BACKEND_URL || defaultBackend;
  const redirectUri = `${backendBase.replace(/\/+$/, "")}/api/v1/auth/google/callback`;

  return new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, redirectUri);
};

// Step 1: Redirect user to Google consent screen
router.get("/auth/google", (req, res) => {
  const oAuthClient = getOAuthClient(req);

  const queryRedirect = (req.query.redirect as string) || (req.query.state as string);
  const referer = req.get("referer") || "";
  let frontendTarget = queryRedirect;
  if (!frontendTarget) {
    if (referer.includes("localhost") || referer.includes("127.0.0.1")) {
      frontendTarget = "http://localhost:3000";
    } else {
      frontendTarget = process.env.FRONTEND_URL || "https://trymino.vercel.app";
    }
  }

  const authorizeUrl = oAuthClient.generateAuthUrl({
    access_type: "offline",
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    prompt: "consent",
    state: frontendTarget,
  });

  return res.redirect(authorizeUrl);
});

// Step 2: Google redirects here with authorization code
router.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code as string;
  const state = req.query.state as string;
  const frontendUrl = state || process.env.FRONTEND_URL || "https://trymino.vercel.app";

  if (!code) {
    return res.redirect(`${frontendUrl}/login?error=no_code`);
  }

  try {
    const oAuthClient = getOAuthClient(req);

    // Exchange code for tokens
    const { tokens } = await oAuthClient.getToken(code);
    oAuthClient.setCredentials(tokens);

    // Verify the ID token and extract user info
    const ticket = await oAuthClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.redirect(`${frontendUrl}/login?error=no_email`);
    }

    const { email, sub: googleId, picture, name } = payload;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Existing user — update Google info and profile picture
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: googleId,
          profilePicture: user.profilePicture || picture || null,
          name: user.name || name || null,
        },
      });
    } else {
      // New user — create account
      user = await prisma.user.create({
        data: {
          email,
          googleId: googleId,
          profilePicture: picture || null,
          name: name || null,
        },
      });
    }

    // Issue JWT (same format as email/password login)
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    // Redirect to frontend with token
    return res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  } catch (err) {
    console.error("Google OAuth error:", err);
    return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
  }
});

export default router
