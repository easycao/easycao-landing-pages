import { getFirebaseAuth, getFirestoreDb } from "./firebase-admin";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "session";
const SESSION_EXPIRY_MS = 60 * 60 * 24 * 14 * 1000; // 14 days

export async function createSession(idToken: string): Promise<string> {
  const sessionCookie = await getFirebaseAuth().createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRY_MS,
  });
  return sessionCookie;
}

export async function verifySession(
  sessionCookie: string
): Promise<{ uid: string; email: string } | null> {
  try {
    const decoded = await getFirebaseAuth().verifySessionCookie(
      sessionCookie,
      true
    );
    return { uid: decoded.uid, email: decoded.email || "" };
  } catch {
    return null;
  }
}

export async function checkIsAdmin(uid: string): Promise<boolean> {
  const doc = await getFirestoreDb().collection("admins").doc(uid).get();
  return doc.exists && doc.data()?.isAdmin === true;
}

export function setSessionCookie(sessionCookie: string) {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    name: SESSION_COOKIE_NAME,
    value: sessionCookie,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_EXPIRY_MS / 1000,
  };
}

export function destroySessionCookie() {
  return {
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}

export async function getSessionFromCookies(): Promise<{
  uid: string;
  email: string;
} | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;
  return verifySession(session);
}
