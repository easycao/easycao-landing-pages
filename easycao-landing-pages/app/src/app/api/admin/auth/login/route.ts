import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  checkIsAdmin,
  setSessionCookie,
} from "@/lib/auth";

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Authenticate via Firebase Auth REST API (server-side, no client SDK)
    const authRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (!authRes.ok) {
      const err = await authRes.json();
      const code = err?.error?.message;
      if (
        code === "EMAIL_NOT_FOUND" ||
        code === "INVALID_PASSWORD" ||
        code === "INVALID_LOGIN_CREDENTIALS"
      ) {
        return NextResponse.json(
          { error: "Email ou senha incorretos" },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: "Erro na autenticação" },
        { status: 401 }
      );
    }

    const { idToken, localId: uid } = await authRes.json();

    // Verify admin status
    const isAdmin = await checkIsAdmin(uid);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Acesso negado — usuário não é administrador" },
        { status: 403 }
      );
    }

    // Create session cookie
    const sessionCookie = await createSession(idToken);
    const response = NextResponse.json({ success: true });
    response.cookies.set(setSessionCookie(sessionCookie));

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
